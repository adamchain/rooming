import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Generate historical data from 2005 to present
const generateHistoricalData = () => {
  const data = [];
  let value = 250000; // Starting value in 2005
  
  for (let year = 2005; year <= 2024; year++) {
    // Add realistic market growth with variations
    let growthRate = 1.12; // Base 12% annual growth
    
    // Housing boom 2005-2007
    if (year <= 2007) growthRate = 1.18;
    
    // Housing crisis impact
    if (year === 2008) growthRate = 0.75; // Sharp decline
    if (year === 2009) growthRate = 0.85; // Continued impact
    
    // Recovery and growth 2010-2019
    if (year >= 2010 && year <= 2019) growthRate = 1.15;
    
    // Covid impact and recovery
    if (year === 2020) growthRate = 0.85;
    if (year === 2021) growthRate = 1.25; // Strong recovery
    if (year >= 2022) growthRate = 1.14; // Recent growth
    
    value = value * growthRate;
    
    // Add some natural variation
    const variation = 1 + (Math.random() * 0.04 - 0.02); // ±2% random variation
    value = value * variation;
    
    data.push({
      year: year.toString(),
      historical: Math.round(value),
      projected: null
    });
  }
  
  // Generate projected data (2024-2035)
  let projectedValue = value;
  for (let year = 2024; year <= 2035; year++) {
    projectedValue *= 1.10; // 10% projected annual growth
    data.push({
      year: year.toString(),
      historical: year === 2024 ? Math.round(value) : null,
      projected: Math.round(projectedValue)
    });
  }
  
  return data;
};

const data = generateHistoricalData();

export function PortfolioChart() {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
          <XAxis 
            dataKey="year"
            tickFormatter={(value) => value}
            interval={2}
          />
          <YAxis
            tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
          />
          <Tooltip
            formatter={(value: number) => [
              `$${(value / 1000000).toFixed(2)}M`,
              value === data[0].historical ? 'Historical Value' : 'Projected Value'
            ]}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="historical"
            name="Historical Value"
            stroke="#024b7e"
            fill="#bfdbfe"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="projected"
            name="Projected Value"
            stroke="#1e3f66"
            fill="#dbeafe"
            strokeWidth={2}
            strokeDasharray="5 5"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}