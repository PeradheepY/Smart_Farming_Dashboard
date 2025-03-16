import React, { useState } from 'react';

interface ToggleSwitchProps {
  isOn: boolean;
  onToggle: (newState: boolean) => Promise<void>;
  label?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ 
  isOn, 
  onToggle, 
  label,
  className = '',
  size = 'md'
}) => {
  const [loading, setLoading] = useState(false);
  const [optimisticState, setOptimisticState] = useState<boolean | null>(null);
  
  // Actual state is either the optimistic state or the prop
  const actualState = optimisticState !== null ? optimisticState : isOn;
  
  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (loading) return;

    const newState = !actualState;
    
    try {
      setLoading(true);
      // Optimistic update
      setOptimisticState(newState);
      
      // Call parent handler
      await onToggle(newState);
      
      // Reset optimistic state on success
      setOptimisticState(null);
    } catch (error) {
      console.error('Toggle failed:', error);
      // Revert optimistic update on failure
      setOptimisticState(null);
    } finally {
      setLoading(false);
    }
  };

  // Rest of your component stays the same, just use actualState instead of isOn
  const sizeClasses = size === 'sm' ? 'h-6 w-12' : 
                     size === 'lg' ? 'h-10 w-16' : 
                     'h-8 w-14';

  const buttonSizeClasses = size === 'sm' ? 'h-5 w-5' :
                          size === 'lg' ? 'h-9 w-9' :
                          'h-7 w-7';

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <button
        type="button"
        onClick={handleToggle}
        disabled={loading}
        className={`relative inline-flex items-center rounded-full transition-colors duration-300 
          ${sizeClasses} 
          ${actualState ? 'bg-fieldgreen' : 'bg-gray-700'}
          ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        aria-pressed={actualState}
      >
        <span 
          className={`absolute inline-block transform transition-transform duration-300
            ${buttonSizeClasses} bg-white rounded-full shadow-md
            ${actualState ? 'translate-x-full' : 'translate-x-0'}
            ${loading ? 'opacity-50' : ''}`} 
        />
      </button>
      {label && (
        <span className={`mt-2 text-sm font-medium ${actualState ? 'text-fieldgreen' : 'text-gray-400'}`}>
          {loading ? 'Updating...' : (actualState ? 'ON' : 'OFF')}
        </span>
      )}
    </div>
  );
};

export default ToggleSwitch;
