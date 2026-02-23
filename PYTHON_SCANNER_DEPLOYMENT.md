# Python Fingerprint Scanner Deployment Guide

## Overview

The Python fingerprint scanner is a **Flask API service** that performs biometric fingerprint matching for the LAMS (Laboratory Attendance Management System).

### What It Does

1. **Receives** a scanned fingerprint image (base64 encoded)
2. **Compares** it against a database of stored fingerprints
3. **Returns** the best match with a similarity score (75% threshold)

### Technology Stack

- **Flask** - Python web framework
- **OpenCV** - Image processing
- **NumPy/SciPy** - Mathematical operations
- **scikit-image** - Image skeletonization

---

## How It Connects to Laravel

### Architecture Flow

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│  Fingerprint    │         │   Laravel App    │         │  Python Flask   │
│  Scanner Device │ ──────> │  (Frontend/API)  │ ──────> │  API (Port 7000)│
│  (Hardware)     │         │                  │         │                  │
└─────────────────┘         └──────────────────┘         └─────────────────┘
                                     │                            │
                                     │                            │
                                     ▼                            ▼
                            ┌──────────────────┐       ┌──────────────────┐
                            │  PostgreSQL DB   │       │  Image Processing│
                            │  (User Data)     │       │  (Minutiae Match)│
                            └──────────────────┘       └──────────────────┘
```

### Integration Points

**1. Attendance Page (`/attendance`)**
- JavaScript captures fingerprint from hardware device
- Fetches all student fingerprints from Laravel API
- Sends captured fingerprint + database to Python API
- Python API returns match result
- Laravel records attendance

**2. User Registration**
- Admin enrolls new users with fingerprints
- Fingerprints stored as PNG images in Laravel storage
- Images referenced in database for comparison

### Code Flow

**JavaScript (attendance.js):**
```javascript
// 1. Capture fingerprint from device
currentFingerPrint = capturedImage;

// 2. Fetch all student fingerprints from Laravel
fetch("../api/users/list?key=student")

// 3. Send to Python API for matching
fetch("http://127.0.0.1:7000/identify", {
    method: "POST",
    body: JSON.stringify({
        database: allFingerprints,  // All stored fingerprints
        input: currentFingerPrint    // Scanned fingerprint
    })
})

// 4. Process result
.then(result => {
    if (result.match_found) {
        // Record attendance in Laravel
        fetch("../api/attendances/save", {
            user_id: result.best_match,
            status: "IN" or "OUT"
        })
    }
})
```

---

## Local Development Setup

### Prerequisites

```bash
# Python 3.8 or higher
python --version

# pip (Python package manager)
pip --version
```

### Installation

```bash
# Navigate to python-scanner directory
cd python-scanner

# Install dependencies
pip install flask flask-cors opencv-python numpy scipy scikit-image
```

### Run Locally

```bash
# Start the Flask server
python index.py

# Server will run on http://localhost:7000
```

### Test the API

```bash
# Test endpoint
curl -X POST http://localhost:7000/identify \
  -H "Content-Type: application/json" \
  -d '{
    "input": "base64_encoded_fingerprint",
    "database": [
      {
        "id": 1,
        "png_base64": ["base64_image1", "base64_image2"]
      }
    ]
  }'
```

---

## Deployment to Render.com

### Step 1: Prepare Files

Create `requirements.txt` in `python-scanner/` directory:

```txt
Flask==3.0.0
flask-cors==4.0.0
opencv-python-headless==4.8.1.78
numpy==1.24.3
scipy==1.11.4
scikit-image==0.22.0
Pillow==10.1.0
```

**Note:** Use `opencv-python-headless` instead of `opencv-python` for deployment (no GUI dependencies).

### Step 2: Create Dockerfile

Create `Dockerfile` in `python-scanner/` directory:

```dockerfile
FROM python:3.11-slim

# Install system dependencies for OpenCV
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Expose port
EXPOSE 7000

# Run the application
CMD ["python", "index.py"]
```

### Step 3: Update Flask App for Production

Modify `index.py` to use production settings:

```python
if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 7000))
    debug = os.environ.get('FLASK_ENV') != 'production'
    app.run(host='0.0.0.0', port=port, debug=debug)
```

### Step 4: Create Render Web Service

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name:** `lams-fingerprint-api`
   - **Environment:** `Docker`
   - **Root Directory:** `python-scanner`
   - **Dockerfile Path:** `./Dockerfile`
   - **Region:** Same as Laravel app
   - **Plan:** Free or Starter

### Step 5: Environment Variables

Add in Render dashboard:

```env
FLASK_ENV=production
PORT=7000
SIMILARITY_THRESHOLD=0.75
```

### Step 6: Deploy

Click **"Create Web Service"** - Render will build and deploy.

Your API will be available at: `https://lams-fingerprint-api.onrender.com`

---

## Update Laravel to Use Deployed API

### Update JavaScript Files

**File:** `public/js/fingerprint/attendance.js`

Change line ~330:
```javascript
// OLD (local)
await fetch("http://127.0.0.1:7000/identify", {

// NEW (production)
await fetch("https://lams-fingerprint-api.onrender.com/identify", {
```

### Use Environment Variable (Better Approach)

**1. Add to Laravel `.env`:**
```env
FINGERPRINT_API_URL=https://lams-fingerprint-api.onrender.com
```

**2. Create config file `config/fingerprint.php`:**
```php
<?php

return [
    'api_url' => env('FINGERPRINT_API_URL', 'http://127.0.0.1:7000'),
];
```

**3. Pass to JavaScript via Blade:**

In `resources/views/attendance/index.blade.php`:
```blade
<script>
    window.FINGERPRINT_API_URL = "{{ config('fingerprint.api_url') }}";
</script>
```

**4. Use in JavaScript:**
```javascript
await fetch(`${window.FINGERPRINT_API_URL}/identify`, {
    method: "POST",
    // ...
})
```

---

## API Documentation

### Endpoint: POST /identify

**Request:**
```json
{
  "input": "base64_encoded_fingerprint_image",
  "database": [
    {
      "id": 1,
      "png_base64": [
        "base64_image_1",
        "base64_image_2",
        "base64_image_3",
        "base64_image_4",
        "base64_image_5"
      ]
    },
    {
      "id": 2,
      "png_base64": ["..."]
    }
  ]
}
```

**Response (Match Found):**
```json
{
  "match_found": true,
  "best_match": 1,
  "similarity_score": 0.8523,
  "message": "Successful match above threshold"
}
```

**Response (No Match):**
```json
{
  "match_found": false,
  "best_candidate": 2,
  "highest_similarity": 0.6234,
  "message": "No matches above 75% similarity threshold"
}
```

---

## How the Fingerprint Matching Works

### Algorithm Steps

1. **Preprocessing**
   - Convert to grayscale
   - Enhance contrast (CLAHE)
   - Apply median blur
   - Binary thresholding
   - Skeletonize ridges

2. **Minutiae Extraction**
   - Detect ridge endings
   - Detect bifurcations
   - Store coordinates

3. **Matching**
   - Build KD-Tree for fast spatial search
   - Match minutiae points within distance threshold
   - Calculate similarity score
   - Return best match if above 75% threshold

### Key Parameters

```python
SIMILARITY_THRESHOLD = 0.75  # 75% match required
distance_threshold = 18      # Pixel distance for minutiae matching
```

---

## Troubleshooting

### Issue 1: CORS Errors

**Problem:** Browser blocks requests from Laravel to Python API.

**Solution:** Already handled with `flask-cors`:
```python
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
```

### Issue 2: OpenCV Import Error

**Problem:** `ImportError: libGL.so.1: cannot open shared object file`

**Solution:** Install system dependencies (already in Dockerfile):
```dockerfile
RUN apt-get install -y libgl1-mesa-glx libglib2.0-0
```

### Issue 3: Slow Matching

**Problem:** Takes too long to match fingerprints.

**Solutions:**
- Reduce number of samples per user (currently 5)
- Increase distance threshold
- Use faster algorithm (consider deep learning models)

### Issue 4: Low Match Accuracy

**Problem:** Valid fingerprints not matching.

**Solutions:**
- Lower `SIMILARITY_THRESHOLD` (e.g., 0.65)
- Improve image quality during enrollment
- Increase `distance_threshold` for minutiae matching
- Collect more samples per user

---

## Production Considerations

### 1. Security

**Add API Key Authentication:**
```python
from functools import wraps

API_KEY = os.environ.get('API_KEY', 'your-secret-key')

def require_api_key(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if request.headers.get('X-API-Key') != API_KEY:
            return jsonify({"error": "Unauthorized"}), 401
        return f(*args, **kwargs)
    return decorated_function

@app.route('/identify', methods=['POST'])
@require_api_key
def identify_fingerprint():
    # ...
```

### 2. Rate Limiting

```python
from flask_limiter import Limiter

limiter = Limiter(
    app=app,
    key_func=lambda: request.remote_addr,
    default_limits=["100 per hour"]
)

@app.route('/identify', methods=['POST'])
@limiter.limit("10 per minute")
def identify_fingerprint():
    # ...
```

### 3. Logging

```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

@app.route('/identify', methods=['POST'])
def identify_fingerprint():
    logging.info(f"Fingerprint match request from {request.remote_addr}")
    # ...
```

### 4. Error Handling

Already implemented with try-catch blocks and proper HTTP status codes.

### 5. Performance Monitoring

Add health check endpoint:
```python
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat()
    })
```

---

## Cost Considerations

### Render Free Tier

- **750 hours/month** of runtime
- **Sleeps after 15 minutes** of inactivity
- **First request after sleep:** ~30 seconds to wake up

### Recommendations

1. **Use Starter Plan ($7/month)** for production:
   - No sleep
   - Faster response times
   - Better for real-time attendance

2. **Optimize for Free Tier:**
   - Keep API awake with cron job pinging every 14 minutes
   - Show loading indicator during wake-up

---

## Alternative: Deploy Both Services Together

You can deploy Laravel and Python API in the same Docker container:

**Multi-stage Dockerfile:**
```dockerfile
# Stage 1: Python API
FROM python:3.11-slim as python-api
WORKDIR /python-app
COPY python-scanner/requirements.txt .
RUN pip install -r requirements.txt
COPY python-scanner/ .

# Stage 2: Laravel + Python
FROM php:8.2-apache
# ... (Laravel setup)

# Copy Python app
COPY --from=python-api /python-app /var/www/python-api
COPY --from=python-api /usr/local/lib/python3.11 /usr/local/lib/python3.11

# Install Python
RUN apt-get update && apt-get install -y python3

# Start both services
CMD python3 /var/www/python-api/index.py & apache2-foreground
```

---

## Summary

The Python fingerprint scanner is a critical microservice that:

✅ Performs biometric matching for attendance  
✅ Runs independently from Laravel  
✅ Communicates via REST API  
✅ Can be deployed separately on Render  
✅ Provides 75% accuracy threshold matching  

**Next Steps:**
1. Deploy Python API to Render
2. Update Laravel environment variables
3. Test end-to-end fingerprint attendance flow
4. Monitor performance and accuracy

🚀 Your biometric attendance system will be fully operational!
