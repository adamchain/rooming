import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Calculator, CreditCard, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Asset Manager Card */}
        <div className="bg-white dark:bg-[#252525] rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-[#3b3b3b]">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                  <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="ml-3 text-lg font-medium text-gray-900 dark:text-white">Asset Manager</h2>
              </div>
              <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-full">
                Portfolio
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Manage your property portfolio, track performance metrics, and analyze investment returns.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="bg-gray-50 dark:bg-[#1b1b1b] p-3 rounded">
                <p className="text-sm text-gray-500 dark:text-gray-400">Properties</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">3</p>
              </div>
              <div className="bg-gray-50 dark:bg-[#1b1b1b] p-3 rounded">
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Value</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">$3.2M</p>
              </div>
            </div>
            <div className="mt-6">
              <Link 
                to="/assets" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                View Portfolio
              </Link>
            </div>
          </div>
        </div>

        {/* QuickBooks Card */}
        <div className="bg-white dark:bg-[#252525] rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-[#3b3b3b]">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-full">
                  <Calculator className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="ml-3 text-lg font-medium text-gray-900 dark:text-white">QuickBooks</h2>
              </div>
              <span className="px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 rounded-full">
                Financials
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Connect to QuickBooks to sync financial data, track expenses, and generate reports.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="bg-gray-50 dark:bg-[#1b1b1b] p-3 rounded">
                <p className="text-sm text-gray-500 dark:text-gray-400">Revenue</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">$846K</p>
              </div>
              <div className="bg-gray-50 dark:bg-[#1b1b1b] p-3 rounded">
                <p className="text-sm text-gray-500 dark:text-gray-400">Expenses</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">$571K</p>
              </div>
            </div>
            <div className="mt-6">
              <Link 
                to="/quickbooks" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
              >
                <Calculator className="mr-2 h-4 w-4" />
                View Financials
              </Link>
            </div>
          </div>
        </div>

        {/* GETTRX Payments Card */}
        <div className="bg-white dark:bg-[#252525] rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-[#3b3b3b]">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                  <CreditCard className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h2 className="ml-3 text-lg font-medium text-gray-900 dark:text-white">Payments</h2>
              </div>
              <span className="px-2 py-1 text-xs font-medium bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 rounded-full">
                GETTRX
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Process payments, manage transactions, and handle rent collection securely.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="bg-gray-50 dark:bg-[#1b1b1b] p-3 rounded">
                <p className="text-sm text-gray-500 dark:text-gray-400">Transactions</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">24</p>
              </div>
              <div className="bg-gray-50 dark:bg-[#1b1b1b] p-3 rounded">
                <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">$12.5K</p>
              </div>
            </div>
            <div className="mt-6">
              <Link 
                to="/payments" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700"
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Manage Payments
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white dark:bg-[#252525] rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-[#3b3b3b]">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-[#3b3b3b]">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Recent Activity</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <CreditCard className="h-5 w-5 text-purple-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Payment Received</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">$1,250.00 from John Smith</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Building2 className="h-5 w-5 text-blue-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Property Value Updated</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Sunset Apartments increased by 3.2%</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">1 day ago</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Calculator className="h-5 w-5 text-green-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Financial Report Generated</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">April 2025 financial summary</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">2 days ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}