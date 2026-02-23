import cv2
import numpy as np
from skimage.morphology import skeletonize
from scipy.spatial import KDTree


def preprocess(image_path):
    # Read image
    img = cv2.imread(image_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Enhance contrast
    clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))
    enhanced = clahe.apply(gray)

    # Apply median blur to reduce noise while keeping ridges
    blurred = cv2.medianBlur(enhanced, 3)

    # Strict thresholding to capture only the darkest regions
    _, binary = cv2.threshold(blurred, 60, 255, cv2.THRESH_BINARY_INV)

    # Skeletonization
    skeleton = skeletonize(binary // 255)
    skeleton = (skeleton * 255).astype(np.uint8)

    return img, skeleton


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


def match_fingerprints(minutiae1, minutiae2, distance_threshold=15):
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
    similarity_score = (match_endings + match_bifurcations) / total_minutiae if total_minutiae else 0

    return similarity_score, minutiae1, minutiae2


def visualize_minutiae(image, minutiae, output_path):
    debug_img = image.copy()
    for m_type, (x, y) in minutiae:
        color = (0, 0, 255) if m_type == 'ending' else (0, 255, 0)  # Red for endings, green for bifurcations
        cv2.circle(debug_img, (x, y), 4, color, -1)

    cv2.imwrite(output_path, debug_img)
    return debug_img


# Example usage
if __name__ == "__main__":
    img1, skeleton1 = preprocess("f1.png")
    img2, skeleton2 = preprocess("f2.png")

    minutiae1 = extract_minutiae(skeleton1)
    minutiae2 = extract_minutiae(skeleton2)

    similarity, minutiae1, minutiae2 = match_fingerprints(minutiae1, minutiae2)

    print(f"Total minutiae in Image 1: {len(minutiae1)}")
    print(f"Total minutiae in Image 2: {len(minutiae2)}")
    print(f"Fingerprint similarity: {similarity:.2%}")

    # Save debug images with minutiae points
    debug_img1 = visualize_minutiae(img1, minutiae1, "debug_f1.png")
    debug_img2 = visualize_minutiae(img2, minutiae2, "debug_f2.png")

    # Display
    cv2.imshow("Skeleton 1", skeleton1)
    cv2.imshow("Skeleton 2", skeleton2)
    cv2.imshow("Minutiae 1", debug_img1)
    cv2.imshow("Minutiae 2", debug_img2)
    cv2.waitKey(0)
    cv2.destroyAllWindows()
