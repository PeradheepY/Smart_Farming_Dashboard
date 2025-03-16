from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os
import random
import time
from datetime import datetime
import firebase_admin
from firebase_admin import credentials, db

app = Flask(__name__)
CORS(app)

# Get the Firebase credentials from environment variables or use a default path
cred_path = os.environ.get('FIREBASE_CRED_PATH', 'Backend/api/firebase-credentials.json')

try:
    # Initialize Firebase Admin SDK
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred, {
        'databaseURL': 'https://smart-farming-monitor-2025-default-rtdb.firebaseio.com'
    })
except Exception as e:
    print(f"Failed to initialize Firebase: {e}")
    

# Mock sensor data for testing
last_water_level = 6
last_temperature = 84
last_humidity = 62

@app.route('/api/sensor-data', methods=['GET'])
def get_sensor_data():
    """Get the latest sensor data"""
    global last_water_level, last_temperature, last_humidity
    
    try:
        # Try to get the latest data from Firebase first
        ref = db.reference('sensors')
        latest_data = ref.order_by_child('timestamp').limit_to_last(1).get()
        
        if latest_data:
            # Convert the data to list and get the first item
            return jsonify(list(latest_data.values())[0])
            
    except Exception as e:
        print(f"Failed to read from Firebase: {e}")
    
    # Fall back to mock data if Firebase read fails
    data = {
        'timestamp': datetime.now().isoformat(),
        'waterLevel': last_water_level,
        'temperature': last_temperature,
        'humidity': last_humidity,
    }
    
    # Still try to save the mock data to Firebase
    try:
        ref = db.reference('sensors')
        ref.push(data)
    except Exception as e:
        print(f"Failed to save to Firebase: {e}")
    
    return jsonify(data)

@app.route('/api/control', methods=['POST'])
def update_control():
    """Update control settings"""
    data = request.json
    response = {'status': 'success', 'message': 'Settings updated'}
    
    # Log the control change
    print(f"Control update: {json.dumps(data)}")
    
    # Try to save to Firebase if available
    try:
        ref = db.reference('controls')
        ref.push({
            'timestamp': datetime.now().isoformat(),
            'settings': data
        })
    except Exception as e:
        print(f"Failed to save to Firebase: {e}")
        
    return jsonify(response)

@app.route('/api/historical-data', methods=['GET'])
def get_historical_data():
    """Get historical sensor data"""
    hours = request.args.get('hours', default=24, type=int)
    
    # Generate mock historical data
    data = []
    current_time = time.time()
    for i in range(hours):
        timestamp = current_time - (i * 3600)  # Go back i hours
        data.append({
            'timestamp': datetime.fromtimestamp(timestamp).isoformat(),
            'waterLevel': random.uniform(5, 7),
            'temperature': random.randint(70, 90),
            'humidity': random.randint(40, 80),
        })
    
    return jsonify(data)

if __name__ == '__main__':
    # Use environment variable for port or default to 5000
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)
