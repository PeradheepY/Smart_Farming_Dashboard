import React, { useEffect, useState, useRef } from 'react';

interface WaterLevelGaugeProps {
  level: number;
  maxLevel?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const WaterLevelGauge: React.FC<WaterLevelGaugeProps> = ({
  level,
  maxLevel = 10,
  size = 'md',
  className = '',
}) => {
  // Round the input level to one decimal place
  const roundedLevel = Math.round(level * 10) / 10;
  const [displayLevel, setDisplayLevel] = useState(roundedLevel);
  const [isRising, setIsRising] = useState(false);
  const prevLevel = useRef(roundedLevel);
  
  // Calculate percentage using the rounded level
  const percentage = (roundedLevel / maxLevel) * 100;
  
  // Determine dimensions based on size
  const dimensions = {
    sm: { width: 120, height: 120, fontSize: '1.8rem', waveHeight: 5 },
    md: { width: 180, height: 180, fontSize: '3rem', waveHeight: 8 },
    lg: { width: 240, height: 240, fontSize: '4.2rem', waveHeight: 10 },
  }[size];

  useEffect(() => {
    // Detect if water level is rising or falling
    if (level > prevLevel.current) {
      setIsRising(true);
    } else if (level < prevLevel.current) {
      setIsRising(false);
    }
    prevLevel.current = level;

    // Animate the level change
    const timer = setTimeout(() => {
      setDisplayLevel(level);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [level]);

  // Calculate the water color based on level
  const waterColor = percentage > 80 ? '#3bb78f' : 
                    percentage > 40 ? '#45d058' : 
                    percentage > 20 ? '#ffb347' : '#ff6b6b';

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div className="relative" style={{ width: dimensions.width, height: dimensions.width }}>
        {/* Glass Container */}
        <div 
          className="absolute inset-0 rounded-full bg-gray-800 shadow-inner overflow-hidden border border-gray-700"
          style={{ width: dimensions.width, height: dimensions.width }}
        >
          {/* Highlights for glass effect */}
          <div className="absolute top-0 left-0 right-0 h-1/6 bg-gradient-to-b from-white/10 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-1/6 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
        
        {/* Water Fill */}
        <div 
          className="absolute bottom-0 left-0 right-0 overflow-hidden rounded-b-full transition-all duration-1000 ease-out"
          style={{ 
            height: `${percentage}%`,
            width: dimensions.width,
            background: `linear-gradient(to bottom, ${waterColor}dd, ${waterColor})`,
            boxShadow: 'inset 0 10px 20px rgba(0,0,0,0.1)',
            transform: isRising ? 'scale(1.01, 1)' : 'scale(0.99, 1)',
            transition: 'transform 0.5s ease-out, height 1s ease-out'
          }}
        >
          {/* Wave Container */}
          <div 
            className="absolute top-0 left-0 right-0"
            style={{ height: `${dimensions.waveHeight}px`, overflow: 'hidden' }}
          >
            {/* Main Wave */}
            <svg className="absolute" style={{
              top: `-${dimensions.waveHeight * 2}px`,
              left: '0',
              width: `${dimensions.width * 2}px`,
              height: `${dimensions.waveHeight * 4}px`,
              animation: 'moveWave 7s linear infinite',
            }}>
              <path
                d={`M0,0 C${dimensions.width/4},${dimensions.waveHeight * 2} ${dimensions.width/2},${-dimensions.waveHeight * 2} ${dimensions.width},0 C${dimensions.width*1.5},${dimensions.waveHeight * 2} ${dimensions.width*1.75},${-dimensions.waveHeight * 2} ${dimensions.width*2},0 V${dimensions.waveHeight * 4} H0 Z`}
                fill={waterColor}
                fillOpacity="0.8"
              />
            </svg>
            
            {/* Secondary Wave */}
            <svg className="absolute" style={{
              top: `-${dimensions.waveHeight * 2}px`,
              left: '0',
              width: `${dimensions.width * 2}px`,
              height: `${dimensions.waveHeight * 4}px`,
              animation: 'moveWave 9s linear infinite',
              animationDelay: '-2s',
            }}>
              <path
                d={`M0,0 C${dimensions.width/3},${dimensions.waveHeight} ${dimensions.width/1.5},${-dimensions.waveHeight} ${dimensions.width},0 C${dimensions.width*1.25},${dimensions.waveHeight} ${dimensions.width*1.75},${-dimensions.waveHeight} ${dimensions.width*2},0 V${dimensions.waveHeight * 4} H0 Z`}
                fill={waterColor}
                fillOpacity="0.6"
              />
            </svg>
            
            {/* Third Wave */}
            <svg className="absolute" style={{
              top: `-${dimensions.waveHeight * 2}px`,
              left: '0',
              width: `${dimensions.width * 2}px`,
              height: `${dimensions.waveHeight * 4}px`,
              animation: 'moveWave 5s linear infinite',
              animationDelay: '-3s',
            }}>
              <path
                d={`M0,0 C${dimensions.width/5},${dimensions.waveHeight * 1.5} ${dimensions.width/2},${-dimensions.waveHeight * 1.5} ${dimensions.width},0 C${dimensions.width*1.5},${dimensions.waveHeight * 1.5} ${dimensions.width*1.8},${-dimensions.waveHeight * 1.5} ${dimensions.width*2},0 V${dimensions.waveHeight * 4} H0 Z`}
                fill={waterColor}
                fillOpacity="0.4"
              />
            </svg>
          </div>
          
          {/* Water Bubbles */}
          {isRising && (
            <div className="absolute inset-0">
              <div className="bubble-sm" style={{ left: '30%', animationDelay: '0s' }}></div>
              <div className="bubble-md" style={{ left: '45%', animationDelay: '1.2s' }}></div>
              <div className="bubble-sm" style={{ left: '60%', animationDelay: '0.5s' }}></div>
              <div className="bubble-lg" style={{ left: '75%', animationDelay: '1.8s' }}></div>
              <div className="bubble-md" style={{ left: '20%', animationDelay: '2.5s' }}></div>
              <div className="bubble-sm" style={{ left: '85%', animationDelay: '0.7s' }}></div>
            </div>
          )}
        </div>
        
        {/* Value Text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span style={{ fontSize: dimensions.fontSize }} className="font-bold text-white drop-shadow-lg">
            {displayLevel.toFixed(1)}
          </span>
        </div>
        
        {/* Max Level Mark */}
        <div className="absolute top-0 left-0 right-0 flex justify-center">
          <div className="h-1 w-10 bg-white/30 rounded-full mt-3"></div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes moveWave {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
        
        @keyframes floatUp {
          0% { transform: translateY(100%); opacity: 0; }
          50% { opacity: 0.8; }
          100% { transform: translateY(-200%); opacity: 0; }
        }
        
        .bubble-sm {
          position: absolute;
          bottom: 0;
          width: 4px;
          height: 4px;
          background: rgba(255, 255, 255, 0.7);
          border-radius: 50%;
          transform: translateY(100%);
          animation: floatUp 4s infinite ease-in-out;
        }
        
        .bubble-md {
          position: absolute;
          bottom: 0;
          width: 6px;
          height: 6px;
          background: rgba(255, 255, 255, 0.7);
          border-radius: 50%;
          transform: translateY(100%);
          animation: floatUp 6s infinite ease-in-out;
        }
        
        .bubble-lg {
          position: absolute;
          bottom: 0;
          width: 8px;
          height: 8px;
          background: rgba(255, 255, 255, 0.7);
          border-radius: 50%;
          transform: translateY(100%);
          animation: floatUp 8s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default WaterLevelGauge;
