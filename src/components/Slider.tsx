import React, { useState, useRef, useEffect, useCallback } from 'react';

interface SliderProps {
  min: number;
  max: number;
  value: number;
  step?: number;
  label: string;
  onChange?: (value: number) => void;
  className?: string;
}

const Slider: React.FC<SliderProps> = ({ 
  min, 
  max, 
  value: initialValue, 
  step = 1, 
  label,
  onChange,
  className = ''
}) => {
  const [value, setValue] = useState(initialValue);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  
  // Calculate percentage for positioning
  const percentage = ((value - min) / (max - min)) * 100;
  
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  // Create optimized event handlers with useCallback
  const updateValue = useCallback((clientY: number) => {
    if (!sliderRef.current) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const offsetY = clientY - rect.top;
    const height = rect.height;
    
    // Invert calculation for vertical slider (top is min, bottom is max)
    let newPercentage = Math.max(0, Math.min(100, 100 - (offsetY / height) * 100));
    let newValue = min + (newPercentage / 100) * (max - min);
    
    // Apply step if provided
    if (step) {
      newValue = Math.round(newValue / step) * step;
    }
    
    // Clamp value between min and max
    newValue = Math.max(min, Math.min(max, newValue));
    
    setValue(newValue);
    onChange?.(newValue);
  }, [min, max, step, onChange]);

  const handleStart = useCallback((clientY: number) => {
    setIsDragging(true);
    updateValue(clientY);
    
    // Add visual feedback
    if (thumbRef.current) {
      thumbRef.current.classList.add('scale-110');
      thumbRef.current.classList.add('shadow-lg');
    }
  }, [updateValue]);
  
  const handleMove = useCallback((clientY: number) => {
    if (!isDragging) return;
    
    // Use requestAnimationFrame for smoother updates
    requestAnimationFrame(() => {
      updateValue(clientY);
    });
  }, [isDragging, updateValue]);
  
  const handleEnd = useCallback(() => {
    setIsDragging(false);
    
    // Remove visual feedback
    if (thumbRef.current) {
      thumbRef.current.classList.remove('scale-110');
      thumbRef.current.classList.remove('shadow-lg');
    }
  }, []);
  
  // Set up mouse event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    handleStart(e.clientY);
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  
  const handleMouseMove = (e: MouseEvent) => handleMove(e.clientY);
  
  const handleMouseUp = () => {
    handleEnd();
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };
  
  // Set up touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientY);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientY);
  };
  
  const handleTouchEnd = () => {
    handleEnd();
  };
  
  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex justify-between mb-1">
        <span className="text-xs text-gray-400">{label}</span>
        <span className="text-xs font-medium">{value.toFixed(1)}</span>
      </div>
      <div className="relative h-24">
        <div 
          ref={sliderRef}
          className="absolute h-full w-1 bg-gray-700 rounded-full left-1/2 transform -translate-x-1/2 cursor-pointer"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div 
            ref={thumbRef}
            className="absolute w-6 h-6 bg-fieldgreen rounded-full -left-[11px] transform -translate-y-1/2 cursor-grab active:cursor-grabbing transition-all duration-150 hover:scale-110"
            style={{ 
              top: `${100 - percentage}%`,
              boxShadow: isDragging ? '0 0 10px rgba(69, 208, 88, 0.5)' : 'none',
              transform: `translateY(-50%) scale(${isDragging ? 1.1 : 1})` 
            }}
          />
          <div 
            className="absolute w-1 rounded-full left-0 transition-all duration-150"
            style={{ 
              height: `${percentage}%`, 
              bottom: 0,
              background: `linear-gradient(to top, ${getColorForPercentage(percentage)}, #45d058)`
            }}
          />
        </div>
        <div className="absolute -left-3 text-xs text-gray-500">{min}</div>
        <div className="absolute -left-3 top-0 text-xs text-gray-500">{max}</div>
      </div>
    </div>
  );
};

// Helper function to get color based on percentage
function getColorForPercentage(percentage: number): string {
  if (percentage < 20) return '#ff6b6b';
  if (percentage < 40) return '#ffb347';
  if (percentage < 60) return '#45d058';
  if (percentage < 80) return '#3bb78f';
  return '#20bf55';
}

export default Slider;
