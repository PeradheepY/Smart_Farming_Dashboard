import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, query, orderByChild, limitToLast } from 'firebase/database';



// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Interface for sensor data
export interface SensorData {
  timestamp: string;
  temperature: number;
  humidity: number;
  waterLevel: number;
  drip: boolean;
  sprinkler: boolean;
}

/**
 * Save sensor data to Firebase
 */
export const saveSensorData = async (data: SensorData): Promise<void> => {
  try {
    const sensorRef = ref(database, `sensors/${Date.now()}`);
    await set(sensorRef, data);
    console.log('Data saved successfully');
  } catch (error) {
    console.error('Error saving data to Firebase', error);
    throw error;
  }
};

/**
 * Fetch the latest sensor data from Firebase
 */
export const fetchSensorData = async (): Promise<SensorData | null> => {
  try {
    const sensorRef = ref(database, 'sensors');
    const latestDataQuery = query(sensorRef, orderByChild('timestamp'), limitToLast(1));
    const snapshot = await get(latestDataQuery);
    
    if (snapshot.exists()) {
      // Get the first (and only) child from the snapshot
      const data = Object.values(snapshot.val())[0] as SensorData;
      return data;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching data from Firebase', error);
    throw error;
  }
};

/**
 * Fetch historical sensor data from Firebase
 */
export const fetchHistoricalData = async (limit = 24): Promise<SensorData[]> => {
  try {
    const sensorRef = ref(database, 'sensors');
    const historyQuery = query(sensorRef, orderByChild('timestamp'), limitToLast(limit));
    const snapshot = await get(historyQuery);
    
    if (snapshot.exists()) {
      return Object.values(snapshot.val()) as SensorData[];
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching historical data from Firebase', error);
    throw error;
  }
};

// Test connection
export const testConnection = async () => {
  try {
    const testRef = ref(database, 'test');
    await set(testRef, {
      timestamp: Date.now(),
      message: 'Test connection successful'
    });
    console.log('Firebase connection successful');
    return true;
  } catch (error) {
    console.error('Firebase connection failed:', error);
    return false;
  }
};

export const updateControlState = async (control: 'drip' | 'sprinkler', isOn: boolean): Promise<void> => {
  try {
    const controlRef = ref(database, `controls/${control}`);
    await set(controlRef, {
      isOn,
      timestamp: new Date().toISOString()
    });
    console.log(`${control} set to ${isOn ? 'on' : 'off'}`);
  } catch (error) {
    console.error(`Error updating ${control} state:`, error);
    throw error;
  }
};