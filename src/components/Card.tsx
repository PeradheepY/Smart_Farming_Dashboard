
import React from 'react';
import { Pencil, ArrowUp, Settings, Trash, ChevronDown, UploadCloud, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  collapsible?: boolean;
}

export const Card: React.FC<CardProps> = ({ title, children, className, collapsible = false }) => {
  return (
    <div className={cn(
      "bg-card rounded-md overflow-hidden animate-fade-in", 
      className
    )}>
      <div className="flex justify-between items-center p-3 border-b border-border">
        <h3 className="text-sm font-medium flex items-center">
          {title}
          {collapsible && <ChevronDown className="h-4 w-4 ml-1 text-muted-foreground" />}
        </h3>
        <div className="flex space-x-1">
          <button className="p-1 hover:bg-muted rounded-sm transition-colors">
            <Pencil className="h-4 w-4" />
          </button>
          <button className="p-1 hover:bg-muted rounded-sm transition-colors">
            <ArrowUp className="h-4 w-4" />
          </button>
          <button className="p-1 hover:bg-muted rounded-sm transition-colors">
            <Settings className="h-4 w-4" />
          </button>
          <button className="p-1 hover:bg-muted rounded-sm transition-colors">
            <Trash className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
};

export const MapCard: React.FC<CardProps> = ({ title, children, className }) => {
  return (
    <Card title={title} className={className}>
      <div className="relative">
        {children}
        <div className="absolute top-2 right-2 flex space-x-1">
          <button className="p-1 bg-black/50 rounded-sm hover:bg-black/70 transition-colors">
            <UploadCloud className="h-4 w-4" />
          </button>
          <button className="p-1 bg-black/50 rounded-sm hover:bg-black/70 transition-colors">
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>
    </Card>
  );
};
