import React from 'react';
import { Building2, TrendingUp, Wallet, PieChart, Target, ArrowUpRight } from 'lucide-react';
import { PortfolioChart } from './PortfolioChart';
import { PropertyList } from './PropertyList';
import { GoalsProgress } from './GoalsProgress';
import { PerformanceMetrics } from './PerformanceMetrics';
import { PropertyPerformanceCharts } from './PropertyPerformanceCharts';

export function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              
              <span className="ml-2 text-xl font-semibold text-gray-900">Rooming 360</span>
            </div>
            <div className="flex items-center">
              <button className="ml-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                Connect Supabase
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Wallet className="h-6 w-6 text-blue-600" />
              <h3 className="ml-2 text-lg font-medium text-gray-900">Portfolio Value</h3>
            </div>
            <p className="mt-2 text-3xl font-semibold text-gray-900">$2.4M</p>
            <p className="text-sm text-green-600 flex items-center mt-2">
              <ArrowUpRight className="h-4 w-4" />
              <span className="ml-1">+12.5% YTD</span>
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <TrendingUp className="h-6 w-6 text-blue-600" />
              <h3 className="ml-2 text-lg font-medium text-gray-900">Monthly Income</h3>
            </div>
            <p className="mt-2 text-3xl font-semibold text-gray-900">$18.5K</p>
            <p className="text-sm text-green-600 flex items-center mt-2">
              <ArrowUpRight className="h-4 w-4" />
              <span className="ml-1">+5.2% MoM</span>
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <PieChart className="h-6 w-6 text-blue-600" />
              <h3 className="ml-2 text-lg font-medium text-gray-900">ROI</h3>
            </div>
            <p className="mt-2 text-3xl font-semibold text-gray-900">15.8%</p>
            <p className="text-sm text-green-600 flex items-center mt-2">
              <ArrowUpRight className="h-4 w-4" />
              <span className="ml-1">+2.3% YoY</span>
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Target className="h-6 w-6 text-blue-600" />
              <h3 className="ml-2 text-lg font-medium text-gray-900">Goal Progress</h3>
            </div>
            <p className="mt-2 text-3xl font-semibold text-gray-900">68%</p>
            <p className="text-sm text-blue-600 flex items-center mt-2">
              <span>On track for 2025</span>
            </p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Portfolio Growth</h3>
            <PortfolioChart />
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Metrics</h3>
            <PerformanceMetrics />
          </div>
        </div>

        <div className="mt-8">
          <PropertyPerformanceCharts />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 bg-white rounded-lg shadow">
            <PropertyList />
          </div>
          <div className="bg-white rounded-lg shadow">
            <GoalsProgress />
          </div>
        </div>
      </main>
    </div>
  );
}