import React, { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import SubHeader from '@/components/SubHeader';
import { Card, MapCard } from '@/components/Card';
import Gauge from '@/components/Gauge';
import LineChart from '@/components/LineChart';
import Slider from '@/components/Slider';
import MapView from '@/components/MapView';
import ToggleSwitch from '@/components/ToggleSwitch';
import ValueDisplay from '@/components/ValueDisplay';
import WaterLevelGauge from '@/components/WaterLevelGauge';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from '@/hooks/use-toast';
import { fetchSensorData, saveSensorData } from '@/services/firebase';
import { updateControlState } from '@/services/firebase';

const generateChartData = () => {
  const times = ['12:00', '12:15', '12:30', '12:45', '1:00', '1:15', '1:30', '1:45', '1:51'];
  return times.map(time => ({
    time,
    temperature: Math.floor(Math.random() * 20) + 70, // Random temp between 70-90
    humidity: Math.floor(Math.random() * 40) + 40, // Random humidity between 40-80
  }));
};

const Index = () => {
  const [chartData, setChartData] = useState(generateChartData());
  const [drip, setDrip] = useState(false);
  const [sprinkler, setSprinkler] = useState(false);
  const [waterLevel, setWaterLevel] = useState(6);
  const [temperature, setTemperature] = useState(84);
  const [humidity, setHumidity] = useState(62);
  const isMobile = useIsMobile();
  
  // Simulate data updates and save to Firebase\
  const initialLoad = useRef(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchSensorData();
        if (data) {
          setWaterLevel(data.waterLevel || 6);
          setTemperature(data.temperature || 84);
          setHumidity(data.humidity || 62);
          

          if (!drip && !sprinkler) {
            setDrip(data.drip || false);
            setSprinkler(data.sprinkler || false);
          }

        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    
    
    if (initialLoad.current) {
      fetchData();
      initialLoad.current = false;
    }

    const interval = setInterval(async () => {
      // Generate new random data
      const newTemperature = Math.floor(Math.random() * 20) + 70;
      const newHumidity = Math.floor(Math.random() * 40) + 40;
      const newWaterLevel = Math.max(1, Math.min(10, waterLevel + (Math.random() > 0.5 ? 0.1 : -0.1)));
      
      setTemperature(newTemperature);
      setHumidity(newHumidity);
      setWaterLevel(newWaterLevel);
      
      setChartData(prev => {
        const newData = [...prev];
        // Remove the first data point
        newData.shift();
        // Add a new data point at the end
        const now = new Date();
        const timeString = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
        newData.push({
          time: timeString,
          temperature: newTemperature,
          humidity: newHumidity,
        });
        return newData;
      });

      // Save to Firebase
      try {
        await saveSensorData({
          timestamp: new Date().toISOString(),
          temperature: newTemperature,
          humidity: newHumidity,
          waterLevel: newWaterLevel,
          drip,
          sprinkler
        });
      } catch (error) {
        console.error("Error saving data:", error);
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const handleDripToggle = async (newState: boolean) => {
    
    
    try {
      // Update Firebase
      await updateControlState('drip', newState);
      
      // Update local state
      setDrip(newState);
      
      // Show success toast
      toast({
        // variant: "default",
        title: newState ? "Drip Irrigation Activated" : "Drip Irrigation Deactivated",
        description: newState ? "System is now active" : "System turned off",
      });
      
    } catch (error) {
      console.error("Drip toggle failed:", error);
      
      // Show error toast
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update drip irrigation system",
      });
    }
  };

  const handleSprinklerToggle = async (newState: boolean) => {
    
    try {
      // Update Firebase

      await updateControlState('sprinkler', newState);
      
      // Update local state
      setSprinkler(newState);
      
      // Show success toast
      toast({
        // variant: "default", 
        title: newState ? "Sprinkler Activated" : "Sprinkler Deactivated",
        description: newState ? "Sprinkler system is now active" : "Sprinkler system turned off",
      });
      
    } catch (error) {
      console.error("Sprinkler toggle failed:", error);
      
      // Show error toast
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update sprinkler system",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <SubHeader title="Cropfield Water Tank" />
      
      <main className={`flex-1 p-4 grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-12'}`}>
        {/* Water Tank 01 */}
        <Card title="Water Tank 01" className={isMobile ? 'col-span-1' : 'col-span-3'}>
          <Gauge value={waterLevel * 10} />
        </Card>
        
        {/* Location */}
        <MapCard title="Location" className={isMobile ? 'col-span-1' : 'col-span-4'}>
          <MapView />
        </MapCard>
        
        {/* Current Outside Temp */}
        <Card title="Current Outside Temp" className={isMobile ? 'col-span-1' : 'col-span-2'}>
          <ValueDisplay 
            label="Temperature" 
            value={temperature} 
            unit="°F" 
            timestamp="Just now" 
          />
        </Card>
        
        {/* Humidity */}
        <Card title="Humidity" className={isMobile ? 'col-span-1' : 'col-span-3'}>
          <ValueDisplay 
            label="Humidity" 
            value={humidity} 
            unit="%" 
            timestamp="Just now" 
          />
        </Card>
        
        {/* Temperature & Humidity Chart */}
        <Card title="Temperature & Humidity" className={isMobile ? 'col-span-1' : 'col-span-8'}>
          <div className="flex space-x-4 mb-2">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-fieldgreen rounded-sm mr-1"></div>
              <span className="text-xs">Temperature</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-400 rounded-sm mr-1"></div>
              <span className="text-xs">Humidity</span>
            </div>
          </div>
          <LineChart data={chartData} height={isMobile ? 150 : 200} />
        </Card>
        
        {/* Water Level */}
        <Card title="Water Level" className={isMobile ? 'col-span-1' : 'col-span-4'}>
          <WaterLevelGauge level={waterLevel} maxLevel={10} size={isMobile ? 'sm' : 'md'} />
        </Card>
        
        {/* Controls */}
        <Card title="Controls" className={isMobile ? 'col-span-1' : 'col-span-8'}>
          <div className={`grid gap-4 ${isMobile ? 'grid-cols-2' : 'grid-cols-7'}`}>
            <Slider min={0} max={10} value={waterLevel} label="Water Level" className="col-span-1" />
            <Slider min={0} max={100} value={humidity} label="Dew Point" className="col-span-1" />
            <Slider min={0} max={1000} value={425} label="CO" className="col-span-1" />
            <Slider min={50} max={90} value={75} label="Max Humidity" className="col-span-1" />
            <Slider min={60} max={100} value={92} label="Max Temp." className="col-span-1" />
            <Slider min={0} max={5} value={0} label="Sprinkler Lvl." className="col-span-1" />
            <Slider min={0} max={5} value={1} label="Drip Lvl." className="col-span-1" />
          </div>
        </Card>
        
        {/* Drip Irrigation System */}
        <Card title="Drip Irrigation" className={isMobile ? 'col-span-1' : 'col-span-2'}>
          <ToggleSwitch isOn={drip} onToggle={handleDripToggle} label="Switch" />
        </Card>
        
        {/* Sprinkler 01 */}
        <Card title="Sprinkler 01" className={isMobile ? 'col-span-1' : 'col-span-2'}>
          <ToggleSwitch isOn={sprinkler} onToggle={handleSprinklerToggle} label="Switch" />
        </Card>
      </main>
    </div>
  );
};

export default Index;
