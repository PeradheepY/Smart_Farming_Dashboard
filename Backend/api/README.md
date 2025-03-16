
# Smart Farming Dashboard - Backend API

This is the Python Flask backend for the Smart Farming Dashboard that provides real-time monitoring and control capabilities for agricultural systems.

## Getting Started

### Prerequisites
- Python 3.8 or higher
- Firebase project for data storage

### Installation

1. Create a virtual environment:
   ```
   python -m venv dashboard_venv
   ```

2. Activate the virtual environment:
   - On Windows: `dashboard_venv\Scripts\activate`
   - On macOS/Linux: `source dashboard_venv/bin/activate`

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Set up Firebase (optional):
   - Create a Firebase project in the Firebase Console
   - Generate a service account key (Project Settings → Service accounts → Generate new private key)
   - Save it as `firebase-credentials.json` in this directory
   - Or set the environment variable `FIREBASE_CRED_PATH` to the path of your credentials file

### Running the API

```
python app.py
```

The API will be available at `http://localhost:5000`

## API Endpoints
1. Sensor Data
- `GET /api/sensor-data` - Get the latest sensor readings (temperature, humidity, water level)
- `GET /api/historical-data` - Retrieve historical sensor data with optional date range filtering


2. Control systems

- `POST /api/control` - Update control settings
- `GET /api/control-status` - Get the current control status

## Environment Variables

- `PORT` - Port to run the server on (default: 5000)
- `FIREBASE_CRED_PATH` - Path to Firebase credentials JSON file
