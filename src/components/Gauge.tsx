import { useEffect, useState } from 'react';

interface GaugeProps {
  value: number;
  min?: number;
  max?: number;
  label?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

const Gauge = ({
  value,
  min = 0,
  max = 100,
  label,
  className = '',
  size = 'md',
  color = '#45d058'
}: GaugeProps) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  // Calculate the percentage for the gauge
  const percentage = ((value - min) / (max - min)) * 100;
  
  // Determine the dimensions based on size prop
  const dimensions = {
    sm: { width: 120, height: 120, fontSize: '1.5rem', valueY: 60, labelY: 80 },
    md: { width: 180, height: 180, fontSize: '2rem', valueY: 90, labelY: 120 },
    lg: { width: 240, height: 240, fontSize: '2.5rem', valueY: 120, labelY: 150 }
  }[size];
  
  useEffect(() => {
    // Animate the displayed value
    const timer = setTimeout(() => {
      setDisplayValue(value);
    }, 200);
    
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className={`gauge-container flex justify-center items-center py-8 ${className}`}>
      <svg
        width={dimensions.width}
        height={dimensions.height / 2}
        viewBox={`0 0 ${dimensions.width} ${dimensions.height / 2}`}
      >
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity="0.8" />
            <stop offset="100%" stopColor={color} />
          </linearGradient>
        </defs>
        
        {/* Background arc */}
        <path
          d={`M ${dimensions.width * 0.05} ${dimensions.height / 2} 
               A ${dimensions.width * 0.45} ${dimensions.height * 0.45} 0 0 1 ${dimensions.width * 0.95} ${dimensions.height / 2}`}
          className="gauge-background"
        />
        
        {/* Progress arc with animation */}
        <path
          d={`M ${dimensions.width * 0.05} ${dimensions.height / 2} 
               A ${dimensions.width * 0.45} ${dimensions.height * 0.45} 0 0 1 ${dimensions.width * 0.95} ${dimensions.height / 2}`}
          className="gauge-progress"
          style={{ 
            stroke: 'url(#gaugeGradient)', 
            strokeDasharray: `${Math.PI * dimensions.width * 0.45} ${Math.PI * dimensions.width * 0.45}`,
            strokeDashoffset: `${(100 - percentage) / 100 * Math.PI * dimensions.width * 0.45}`,
            transition: 'stroke-dashoffset 0.3s ease-in-out'
          }}
        />
        
        {/* Value Text */}
        <text
          x="50%"
          y="85%"
          fontSize={dimensions.fontSize}
          fontWeight="bold"
          textAnchor="middle"
          fill="white"
          className="animate-fade-in"
        >
          {displayValue.toFixed(2)}
        </text>
        
        {/* Min and Max labels */}
        <text x="5%" y="98%" fontSize="0.7rem" fill="gray">{min}</text>
        <text x="95%" y="98%" fontSize="0.7rem" fill="gray" textAnchor="end">{max}</text>
      </svg>
    </div>
  );
};

export default Gauge;
