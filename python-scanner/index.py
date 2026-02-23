from flask import Flask, request, jsonify
import base64
import cv2
import numpy as np
from scipy.spatial import KDTree
from skimage.morphology import skeletonize
from scipy.spatial.distance import cdist
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
SIMILARITY_THRESHOLD = 0.75


@app.route('/', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "service": "LAMS Fingerprint API",
        "version": "1.0.0",
        "endpoints": {
            "identify": "/identify (POST)"
        }
    })


@app.route('/health', methods=['GET'])
def health():
    """Alternative health check endpoint"""
    return jsonify({"status": "ok"})


def base64_to_image(base64_str):
    # Remove data URL prefix if present
    if 'base64,' in base64_str:
        base64_str = base64_str.split('base64,')[1]

    img_data = base64.b64decode(base64_str)
    img_array = np.frombuffer(img_data, dtype=np.uint8)
    img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
    return img


def preprocess_image(img):
    # Read image
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Enhance contrast
    clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))  # Increased contrast enhancement
    enhanced = clahe.apply(gray)

    # Apply median blur to reduce noise while keeping ridges
    blurred = cv2.medianBlur(enhanced, 3)

    # Strict thresholding to capture only the darkest regions
    _, binary = cv2.threshold(blurred, 60, 255, cv2.THRESH_BINARY_INV)  # Lowered threshold to 30

    skeleton = skeletonize(binary // 255)
    return skeleton.astype(np.uint8) * 255


def extract_minutiae(skeleton):
    minutiae = []
    kernel = np.array([[1, 1, 1],
                       [1, 10, 1],
                       [1, 1, 1]], dtype=np.uint8)

    # Find minutiae points
    filtered = cv2.filter2D(skeleton // 255, -1, kernel)

    # Ridge endings (value 11) and bifurcations (value 13)
    ridge_endings = np.column_stack(np.where(filtered == 11))
    bifurcations = np.column_stack(np.where(filtered == 13))

    for point in ridge_endings:
        minutiae.append(('ending', tuple(point[::-1])))  # Convert (row, col) -> (x, y)

    for point in bifurcations:
        minutiae.append(('bifurcation', tuple(point[::-1])))  # Convert (row, col) -> (x, y)

    return minutiae


def match_fingerprints(minutiae1, minutiae2, distance_threshold=18):
    if not minutiae1 or not minutiae2:
        return 0, []

    # Separate minutiae types
    endings1 = [m[1] for m in minutiae1 if m[0] == 'ending']
    bifurcations1 = [m[1] for m in minutiae1 if m[0] == 'bifurcation']
    endings2 = [m[1] for m in minutiae2 if m[0] == 'ending']
    bifurcations2 = [m[1] for m in minutiae2 if m[0] == 'bifurcation']

    # Match ridge endings and bifurcations separately
    def count_matches(points1, points2, threshold):
        if not points1 or not points2:
            return 0
        tree = KDTree(points2)
        matches = sum(1 for p in points1 if tree.query(p)[0] < threshold)
        return matches

    match_endings = count_matches(endings1, endings2, distance_threshold)
    match_bifurcations = count_matches(bifurcations1, bifurcations2, distance_threshold)

    # Compute similarity score
    total_minutiae = max(len(minutiae1), len(minutiae2))
    return (match_endings + match_bifurcations) / total_minutiae if total_minutiae else 0



@app.route('/identify', methods=['POST'])
def identify_fingerprint():
    data = request.json

    if not data or 'input' not in data or 'database' not in data:
        return jsonify({"error": "Invalid request format"}), 400

    try:
        # Process input fingerprint
        input_img = base64_to_image(data['input'])
        input_skeleton = preprocess_image(input_img)
        input_minutiae = extract_minutiae(input_skeleton)

        best_match = {'id': None, 'similarity': 0}

        # Compare with all database entries
        for entry in data['database']:
            entry_id = entry.get('id')
            entry_samples = entry.get('png_base64', [])

            if not entry_id or not isinstance(entry_samples, list):
                continue

            max_entry_similarity = 0

            # Process all samples for this ID
            for sample_b64 in entry_samples:
                try:
                    # Process database entry sample
                    db_img = base64_to_image(sample_b64)
                    db_skeleton = preprocess_image(db_img)
                    db_minutiae = extract_minutiae(db_skeleton)

                    # Calculate similarity
                    similarity = match_fingerprints(input_minutiae, db_minutiae)

                    # Keep the best similarity for this ID
                    if similarity > max_entry_similarity:
                        max_entry_similarity = similarity

                except Exception as e:
                    print(f"Error processing sample for {entry_id}: {str(e)}")
                    continue

            # Update global best match
            if max_entry_similarity > best_match['similarity']:
                best_match = {'id': entry_id, 'similarity': max_entry_similarity}

        if not best_match['id']:
            return jsonify({"error": "No valid matches found"}), 404

        # Check against similarity threshold
        if best_match['similarity'] >= SIMILARITY_THRESHOLD:
            return jsonify({
                "match_found": True,
                "best_match": best_match['id'],
                "similarity_score": round(best_match['similarity'], 4),
                "message": "Successful match above threshold"
            })
        else:
            return jsonify({
                "match_found": False,
                "best_candidate": best_match['id'],
                "highest_similarity": round(best_match['similarity'], 4),
                "message": "No matches above 75% similarity threshold"
            })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 7000))
    debug = os.environ.get('FLASK_ENV', 'development') != 'production'
    app.run(host='0.0.0.0', port=port, debug=debug)


    # ss