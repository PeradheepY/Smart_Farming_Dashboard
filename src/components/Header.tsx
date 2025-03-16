
import React from 'react';
import { Leaf, LayoutDashboard, PanelLeft, FileText, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  const [time, setTime] = React.useState(new Date());
  
  React.useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
  };
  
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  };

  return (
    <header className={cn(
      "flex justify-between items-center px-4 py-2 bg-secondary border-b border-border",
      className
    )}>
      <div className="flex items-center">
        <div className="flex items-center text-fieldgreen mr-8">
          <Leaf className="h-6 w-6 mr-2" />
          <span className="font-medium text-lg">FieldMonitor</span>
        </div>
        
        <nav className="flex space-x-2">
          <NavItem icon={<LayoutDashboard size={16} />} label="Dashboard" active />
          <NavItem icon={<PanelLeft size={16} />} label="Devices & Sensors" />
          <NavItem icon={<FileText size={16} />} label="Logs" />
          <NavItem icon={<Settings size={16} />} label="Settings" />
        </nav>
      </div>
      
      <div className="text-sm text-muted-foreground">
        <span>{formatDate(time)}</span>
        <span className="mx-2">•</span>
        <span>{formatTime(time)}</span>
      </div>
    </header>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active = false }) => {
  return (
    <button
      className={cn(
        "flex items-center px-4 py-2 text-sm rounded transition-colors",
        active 
          ? "bg-primary/10 text-primary" 
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      )}
    >
      <span className="mr-2">{icon}</span>
      <span>{label}</span>
    </button>
  );
};

export default Header;
