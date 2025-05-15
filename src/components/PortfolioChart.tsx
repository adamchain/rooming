import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jan', value: 2100000 },
  { month: 'Feb', value: 2150000 },
  { month: 'Mar', value: 2200000 },
  { month: 'Apr', value: 2250000 },
  { month: 'May', value: 2300000 },
  { month: 'Jun', value: 2350000 },
  { month: 'Jul', value: 2400000 },
];

export function PortfolioChart() {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis
            tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
          />
          <Tooltip
            formatter={(value: number) => [`$${(value / 1000000).toFixed(2)}M`, 'Portfolio Value']}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#2563eb"
            fill="#bfdbfe"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}