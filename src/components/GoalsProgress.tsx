import React from 'react';
import { Target, TrendingUp, Wallet } from 'lucide-react';

const goals = [
  {
    name: 'Retirement Fund',
    target: 5000000,
    current: 2400000,
    icon: Target,
  },
  {
    name: 'Portfolio Growth',
    target: 3000000,
    current: 2400000,
    icon: TrendingUp,
  },
  {
    name: 'Monthly Income',
    target: 25000,
    current: 18500,
    icon: Wallet,
  },
];

export function GoalsProgress() {
  return (
    <div className="p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Financial Goals</h3>
      <div className="space-y-4">
        {goals.map((goal) => {
          const Icon = goal.icon;
          const progress = (goal.current / goal.target) * 100;
          
          return (
            <div key={goal.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Icon className="h-5 w-5 text-blue-600" />
                  <span className="ml-2 text-sm font-medium text-gray-900">{goal.name}</span>
                </div>
                <span className="text-sm text-gray-500">{progress.toFixed(0)}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="h-2 bg-blue-600 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>${goal.current.toLocaleString()}</span>
                <span>${goal.target.toLocaleString()}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}