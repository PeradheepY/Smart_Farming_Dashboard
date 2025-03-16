# Smart Farming Dashboard

An IoT-based dashboard for monitoring and controlling agricultural systems in real-time. This project provides farmers with data visualization, irrigation controls, and environmental monitoring capabilities. **Note: The data used in this project is simulated and not from actual hardware.** 

![Demo](https://github.com/PeradheepY/Smart_Farming_Dashboard/blob/main/public/Smart_farming_dashboard.gif)


## Features

- **Real-time Monitoring**: Temperature, humidity, and water level sensors data visualized in real-time
- **Controls**: Toggle drip irrigation and sprinkler systems remotely
- **Data Visualization**: Interactive charts and gauges for environmental metrics

## Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui
- **Build Tool**: Vite
- **Database**: Firebase Realtime Database
- **Charting**: Recharts
- **Backend**: Python Flask

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm 8.x or higher
- Python 3.9.x or higher
- Firebase project for data storage


### Installation

1. Clone the repository
   ```sh
   git clone https://github.com/PeradheepY/smart-farming-dashboard.git
   cd smart-farming-dashboard
   ```

2. Install the necessary dependencies.
   ```sh
   npm install
   ```

3. Create a `.env.local` file in the root directory with your Firebase configuration:
- VITE_FIREBASE_API_KEY=your_api_key
- VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
- VITE_FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
- VITE_FIREBASE_PROJECT_ID=your-project
- VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
- VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
- VITE_FIREBASE_APP_ID=your_app_id


4. Start the development server with auto-reloading and an instant preview.
   ```sh
   npm run dev
   ```