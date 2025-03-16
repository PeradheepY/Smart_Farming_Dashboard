
import React from 'react';
import { Grid, ArrowLeft, Lock, Bell, Monitor } from 'lucide-react';

interface SubHeaderProps {
  title: string;
  className?: string;
}

const SubHeader: React.FC<SubHeaderProps> = ({ title, className = '' }) => {
  return (
    <div className={`flex justify-between items-center px-4 py-3 bg-card border-b border-border ${className}`}>
      <h1 className="text-lg font-medium">{title}</h1>
      
      <div className="flex space-x-2">
        <button className="p-2 rounded-md hover:bg-accent transition-colors">
          <Grid className="h-5 w-5" />
        </button>
        <button className="p-2 rounded-md hover:bg-accent transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <button className="p-2 rounded-md hover:bg-accent transition-colors">
          <Lock className="h-5 w-5" />
        </button>
        <button className="p-2 rounded-md hover:bg-accent transition-colors">
          <Bell className="h-5 w-5" />
        </button>
        <button className="p-2 rounded-md hover:bg-accent transition-colors">
          <Monitor className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default SubHeader;
