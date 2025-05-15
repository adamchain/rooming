import React, { useState } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { sankey, sankeyLinkHorizontal, sankeyCenter } from 'd3-sankey';

const capitalGrowthData = [
  { month: '2023-07', riverside: 850000, downtown: 1200000, sunset: 950000 },
  { month: '2023-08', riverside: 855000, downtown: 1210000, sunset: 960000 },
  { month: '2023-09', riverside: 862000, downtown: 1225000, sunset: 965000 },
  { month: '2023-10', riverside: 868000, downtown: 1235000, sunset: 972000 },
  { month: '2023-11', riverside: 875000, downtown: 1245000, sunset: 980000 },
  { month: '2023-12', riverside: 882000, downtown: 1255000, sunset: 988000 },
];

const monthlyIncomeData = [
  { month: '2023-07', riverside: 6200, downtown: 8500, sunset: 7000 },
  { month: '2023-08', riverside: 6300, downtown: 8600, sunset: 7100 },
  { month: '2023-09', riverside: 6400, downtown: 8700, sunset: 7150 },
  { month: '2023-10', riverside: 6450, downtown: 8800, sunset: 7200 },
  { month: '2023-11', riverside: 6500, downtown: 8900, sunset: 7200 },
  { month: '2023-12', riverside: 6500, downtown: 8900, sunset: 7200 },
];

const expensesData = [
  { category: 'Maintenance', riverside: 1200, downtown: 1800, sunset: 1400 },
  { category: 'Insurance', riverside: 800, downtown: 1200, sunset: 900 },
  { category: 'Property Tax', riverside: 1500, downtown: 2200, sunset: 1700 },
  { category: 'Utilities', riverside: 400, downtown: 600, sunset: 450 },
];

const expensesComparison = [
  { category: 'Maintenance', current: 4400, previous: 4200 },
  { category: 'Insurance', current: 2900, previous: 2900 },
  { category: 'Property Tax', current: 5400, previous: 5200 },
  { category: 'Utilities', current: 1450, previous: 1380 },
  { category: 'Management', current: 2200, previous: 2100 },
];

// Sankey data
const nodes = [
  { name: "Rental Income" },
  { name: "Property Value Growth" },
  { name: "Operating Expenses" },
  { name: "Net Operating Income" },
  { name: "Total Portfolio Growth" }
];

const links = [
  { source: 0, target: 2, value: 270000 }, // Rental Income to Operating Expenses
  { source: 0, target: 3, value: 530000 }, // Rental Income to NOI
  { source: 1, target: 4, value: 480000 }, // Property Value Growth to Total Growth
  { source: 3, target: 4, value: 530000 }, // NOI to Total Growth
];

const timeframeOptions = ['This Year', 'Last Year', '5 Years'];

export function PropertyPerformanceCharts() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('This Year');

  // Calculate dimensions for Sankey diagram
  const width = 800;
  const height = 400;

  const sankeyData = sankey()
    .nodeWidth(15)
    .nodePadding(10)
    .extent([[1, 1], [width - 1, height - 5]])
    .nodeAlign(sankeyCenter)
    ({ nodes, links });

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Capital Growth</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={capitalGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(value) => [`$${(value as number).toLocaleString()}`, 'Value']} />
              <Line type="monotone" dataKey="riverside" name="Riverside Apartments" stroke="#2563eb" strokeWidth={2} />
              <Line type="monotone" dataKey="downtown" name="Downtown Lofts" stroke="#7c3aed" strokeWidth={2} />
              <Line type="monotone" dataKey="sunset" name="Sunset Complex" stroke="#059669" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Rental Income</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyIncomeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `$${value}`} />
              <Tooltip formatter={(value) => [`$${(value as number).toLocaleString()}`, 'Income']} />
              <Area type="monotone" dataKey="riverside" name="Riverside Apartments" stroke="#2563eb" fill="#bfdbfe" stackId="1" />
              <Area type="monotone" dataKey="downtown" name="Downtown Lofts" stroke="#7c3aed" fill="#ddd6fe" stackId="1" />
              <Area type="monotone" dataKey="sunset" name="Sunset Complex" stroke="#059669" fill="#a7f3d0" stackId="1" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Expenses: This Month vs Last Month</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={expensesComparison}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis tickFormatter={(value) => `$${value}`} />
              <Tooltip formatter={(value) => [`$${(value as number).toLocaleString()}`, 'Amount']} />
              <Bar dataKey="current" name="This Month" fill="#2563eb" />
              <Bar dataKey="previous" name="Last Month" fill="#93c5fd" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Portfolio Flow Analysis</h3>
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          >
            {timeframeOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        <div className="h-[400px] relative">
          <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
            <g>
              {sankeyData.links.map((link, i) => (
                <path
                  key={i}
                  d={sankeyLinkHorizontal()(link) as string}
                  fill="none"
                  stroke="#93c5fd"
                  strokeOpacity={0.4}
                  strokeWidth={Math.max(1, link.width)}
                />
              ))}
              {sankeyData.nodes.map((node, i) => (
                <g key={i} transform={`translate(${node.x0},${node.y0})`}>
                  <rect
                    height={node.y1 - node.y0}
                    width={node.x1 - node.x0}
                    fill="#2563eb"
                    strokeWidth={2}
                  />
                  <text
                    x={-6}
                    y={(node.y1 - node.y0) / 2}
                    dy="0.35em"
                    textAnchor="end"
                    fill="#374151"
                    fontSize={12}
                  >
                    {node.name}
                  </text>
                </g>
              ))}
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}