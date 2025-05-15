import React from 'react';
import { Building2, TrendingUp, Wallet, PieChart, Target, ArrowUpRight } from 'lucide-react';
import { PortfolioChart } from './PortfolioChart';
import { PropertyList } from './PropertyList';
import { GoalsProgress } from './GoalsProgress';
import { PerformanceMetrics } from './PerformanceMetrics';
import { PropertyPerformanceCharts } from './PropertyPerformanceCharts';

export function Dashboard() {
  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <nav className="bg-[#024b7e] border-b border-[#1e3f66]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-14">
            <div className="flex items-center">
              <span className="text-lg font-semibold text-white">Rooming 360</span>
            </div>
            <div className="flex items-center">
              <button className="px-4 py-1.5 text-sm font-medium text-white bg-[#1e3f66] rounded hover:bg-[#2a5485] transition-colors">
                Connect Supabase
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="metric-card p-4">
            <div className="flex items-center">
              <Wallet className="h-5 w-5 text-[#024b7e]" />
              <h3 className="ml-2 text-sm font-medium text-gray-700">Portfolio Value</h3>
            </div>
            <p className="mt-1 text-2xl font-semibold text-gray-900">$2.4M</p>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <ArrowUpRight className="h-3 w-3" />
              <span className="ml-1">+12.5% YTD</span>
            </p>
          </div>

          <div className="metric-card p-4">
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 text-[#024b7e]" />
              <h3 className="ml-2 text-sm font-medium text-gray-700">Monthly Income</h3>
            </div>
            <p className="mt-1 text-2xl font-semibold text-gray-900">$18.5K</p>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <ArrowUpRight className="h-3 w-3" />
              <span className="ml-1">+5.2% MoM</span>
            </p>
          </div>

          <div className="metric-card p-4">
            <div className="flex items-center">
              <PieChart className="h-5 w-5 text-[#024b7e]" />
              <h3 className="ml-2 text-sm font-medium text-gray-700">ROI</h3>
            </div>
            <p className="mt-1 text-2xl font-semibold text-gray-900">15.8%</p>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <ArrowUpRight className="h-3 w-3" />
              <span className="ml-1">+2.3% YoY</span>
            </p>
          </div>

          <div className="metric-card p-4">
            <div className="flex items-center">
              <Target className="h-5 w-5 text-[#024b7e]" />
              <h3 className="ml-2 text-sm font-medium text-gray-700">Goal Progress</h3>
            </div>
            <p className="mt-1 text-2xl font-semibold text-gray-900">68%</p>
            <p className="text-xs text-blue-600 flex items-center mt-1">
              <span>On track for 2025</span>
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="chart-container">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Portfolio Growth</h3>
            <PortfolioChart />
          </div>
          <div className="chart-container">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Performance Metrics</h3>
            <PerformanceMetrics />
          </div>
        </div>

        <div className="mt-4">
          <PropertyPerformanceCharts />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 chart-container">
            <PropertyList />
          </div>
          <div className="chart-container">
            <GoalsProgress />
          </div>
        </div>
      </main>
    </div>
  );
}