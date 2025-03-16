
import React from 'react';
import { cn } from '@/lib/utils';

interface ValueDisplayProps {
  label: string;
  value: string | number;
  unit?: string;
  timestamp?: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const ValueDisplay: React.FC<ValueDisplayProps> = ({
  label,
  value,
  unit,
  timestamp,
  color = 'text-fieldgreen',
  size = 'md',
  className,
}) => {
  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-6xl',
  }[size];

  return (
    <div className={cn(
      'flex flex-col items-center justify-center p-6 animate-fade-in',
      className
    )}>
      <p className="text-sm text-gray-400 mb-2">Last value:</p>
      <div className="flex items-center justify-center">
        <span className={cn(sizeClasses, 'font-bold', color)}>
          {value}
        </span>
        {unit && (
          <span className={cn('font-bold ml-1', color, {
            'text-xl': size === 'sm',
            'text-3xl': size === 'md',
            'text-5xl': size === 'lg',
          })}>
            {unit}
          </span>
        )}
      </div>
      {timestamp && (
        <p className="text-xs text-gray-500 mt-2">{timestamp}</p>
      )}
    </div>
  );
};

export default ValueDisplay;
