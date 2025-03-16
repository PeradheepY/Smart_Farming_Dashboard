import React, { useState, useEffect } from 'react';
import { MapPin, Locate } from 'lucide-react';

// Farm location coordinates (kept for reference in UI)
const FARM_LOCATION = {
  lat: 39.742043,
  lng: -104.991531,
  name: "Smart Farm"
};

interface MapViewProps {
  className?: string;
}

const MapView: React.FC<MapViewProps> = ({ className = '' }) => {
  const [time, setTime] = useState(new Date());
  const [showCoordinates, setShowCoordinates] = useState(false);
  
  // Update time every second for the live indicator
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`relative w-full h-[200px] overflow-hidden rounded-md bg-gray-800 ${className}`}>
      {/* Grid layout */}
      <div className="absolute inset-0 opacity-40">
        {/* Horizontal lines */}
        {Array.from({ length: 10 }).map((_, i) => (
          <div 
            key={`h-${i}`} 
            className="absolute w-full h-px bg-gray-600" 
            style={{ top: `${i * 10}%` }} 
          />
        ))}
        
        {/* Vertical lines */}
        {Array.from({ length: 10 }).map((_, i) => (
          <div 
            key={`v-${i}`} 
            className="absolute h-full w-px bg-gray-600" 
            style={{ left: `${i * 10}%` }} 
          />
        ))}
      </div>
      
      {/* Field center pin marker */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
        <div className="relative">
          <MapPin size={32} className="text-fieldgreen" />
          <div className="absolute w-8 h-8 bg-fieldgreen/20 rounded-full -top-1 -left-1 animate-pulse" />
        </div>
      </div>

      {/* Live indicator with blinking red dot */}
      <div className="absolute top-2 left-2 z-30 bg-gray-800/80 p-2 rounded-md text-xs flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="relative flex items-center justify-center w-4 h-4">
            <div className="absolute w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <div className="absolute w-4 h-4 bg-red-500/30 rounded-full animate-ping"></div>
          </div>
          <span className="text-white">LIVE</span>
        </div>
        <div className="text-gray-300 text-[10px] mt-1">
          {time.toLocaleTimeString()}
        </div>
      </div>
      
      {/* Coordinates display (toggleable) */}
      {showCoordinates && (
        <div className="absolute bottom-8 left-2 z-30 bg-gray-800/80 p-2 rounded-md text-xs">
          <div className="text-gray-300">
            Lat: {FARM_LOCATION.lat.toFixed(6)}
          </div>
          <div className="text-gray-300">
            Long: {FARM_LOCATION.lng.toFixed(6)}
          </div>
        </div>
      )}
      
      {/* Coordinates toggle button */}
      <button 
        onClick={() => setShowCoordinates(prev => !prev)}
        className="absolute bottom-2 left-2 z-30 bg-gray-800/80 p-1.5 rounded-md text-xs
                  hover:bg-gray-700/80 transition-colors duration-200 flex items-center gap-1"
      >
        <Locate size={14} className={showCoordinates ? "text-fieldgreen" : "text-white"} />
        <span>{showCoordinates ? "Hide Coordinates" : "Show Coordinates"}</span>
      </button>
      
      {/* Simple measurement scale */}
      <div className="absolute bottom-2 right-2 z-30 bg-gray-800/80 px-2 py-1 rounded-md text-xs flex items-center gap-2">
        <div className="w-8 h-1 bg-gray-400"></div>
        <span className="text-gray-300">100m</span>
      </div>
    </div>
  );
};

export default MapView;