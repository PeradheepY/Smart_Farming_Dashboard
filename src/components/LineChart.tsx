
import React, { useEffect, useState } from 'react';
import { LineChart as RechartLineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface DataPoint {
  time: string;
  temperature?: number;
  humidity?: number;
  [key: string]: any;
}

interface LineChartProps {
  data: DataPoint[];
  height?: number;
  className?: string;
}

const LineChart: React.FC<LineChartProps> = ({ data, height = 250, className = '' }) => {
  const [chartData, setChartData] = useState<DataPoint[]>([]);
  
  useEffect(() => {
    // Animate the data loading
    const timer = setTimeout(() => {
      setChartData(data);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [data]);

  return (
    <div className={`w-full ${className}`} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartLineChart
          data={chartData}
          margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
        >
          <XAxis 
            dataKey="time" 
            tick={{ fill: '#999', fontSize: 10 }} 
            tickLine={{ stroke: '#666' }}
            axisLine={{ stroke: '#666' }}
          />
          <YAxis 
            tick={{ fill: '#999', fontSize: 10 }} 
            tickLine={{ stroke: '#666' }}
            axisLine={{ stroke: '#666' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#222', 
              border: '1px solid #444',
              borderRadius: '4px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
            labelStyle={{ color: '#ccc' }}
            itemStyle={{ color: '#fff' }}
          />
          {chartData.length > 0 && chartData[0].temperature !== undefined && (
            <Line 
              type="monotone" 
              dataKey="temperature" 
              stroke="#45d058" 
              strokeWidth={2}
              dot={{ fill: '#45d058', r: 3 }}
              activeDot={{ r: 5, fill: '#45d058', stroke: '#fff' }}
              animationDuration={1500}
              animationEasing="ease-out"
            />
          )}
          {chartData.length > 0 && chartData[0].humidity !== undefined && (
            <Line 
              type="monotone" 
              dataKey="humidity" 
              stroke="#59c0f2" 
              strokeWidth={2}
              dot={{ fill: '#59c0f2', r: 3 }}
              activeDot={{ r: 5, fill: '#59c0f2', stroke: '#fff' }}
              animationDuration={1500}
              animationEasing="ease-out"
            />
          )}
        </RechartLineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChart;
