import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  Calendar,
  DollarSign,
  Users,
  Clock,
  Building2,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  Settings,
  ChevronRight
} from 'lucide-react';
import tenantService from '../services/tenantService';
import invoiceService from '../services/invoiceService';
import { formatCurrency } from '../utils/formatters';
import { addDays, isAfter, isBefore } from 'date-fns';

export default function Dashboard() {
  const [summary, setSummary] = useState({
    overdueRent: 0,
    upcomingLeaseEnds: 0,
    maintenanceRequests: 0,
    occupancyRate: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(false); // Changed to false to skip loading screen for demo

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Demo data for presentation
      setSummary({
        overdueRent: 2450,
        upcomingLeaseEnds: 3,
        maintenanceRequests: 5,
        occupancyRate: 87.5,
        recentActivity: [
          {
            type: 'payment',
            title: 'Rent Payment Received',
            date: '2024-04-30',
            amount: 1500,
            tenant: 'John Smith'
          },
          {
            type: 'maintenance',
            title: 'New Maintenance Request',
            date: '2024-04-29',
            tenant: 'Emily Johnson'
          },
          {
            type: 'lease',
            title: 'Lease Signed',
            date: '2024-04-28',
            tenant: 'Robert Williams'
          },
          {
            type: 'payment',
            title: 'Late Fee Applied',
            date: '2024-04-27',
            amount: 50,
            tenant: 'Sarah Miller'
          },
          {
            type: 'maintenance',
            title: 'Maintenance Completed',
            date: '2024-04-26',
            tenant: 'Michael Brown'
          }
        ]
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-t-[#0078d4] border-r-[#0078d4] border-b-transparent border-l-transparent"></div>
      </div>
    );
  }

  // Function to get badge class based on activity type
  const getActivityBadge = (type) => {
    switch (type) {
      case 'payment':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300';
      case 'maintenance':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300';
      case 'lease':
        return 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Alert Section */}
      {summary.overdueRent > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-500 p-4 mb-6 rounded-r">
          <div className="flex">
            <AlertTriangle className="h-6 w-6 text-red-500" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
                Attention Required
              </h3>
              <p className="mt-1 text-sm text-red-700 dark:text-red-400">
                You have {formatCurrency(summary.overdueRent)} in overdue rent payments
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-6 mb-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Overdue Rent */}
        <div className="bg-white dark:bg-[#252525] overflow-hidden rounded border border-gray-200 dark:border-[#3b3b3b] transition-colors duration-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/30 text-red-500">
                  <DollarSign className="h-5 w-5" />
                </div>
              </div>
              <div className="ml-4 flex-1">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Overdue Rent
                </div>
                <div className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(summary.overdueRent)}
                  </div>
                  <div className="ml-2 flex items-center text-xs font-medium text-red-500">
                    <ArrowUpRight className="h-3 w-3 mr-0.5" />
                    12.5%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Leases Ending Soon */}
        <div className="bg-white dark:bg-[#252525] overflow-hidden rounded border border-gray-200 dark:border-[#3b3b3b] transition-colors duration-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-2 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-500">
                  <Calendar className="h-5 w-5" />
                </div>
              </div>
              <div className="ml-4 flex-1">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Leases Ending
                </div>
                <div className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {summary.upcomingLeaseEnds}
                  </div>
                  <div className="ml-2 flex items-center text-xs font-medium text-yellow-500">
                    <Clock className="h-3 w-3 mr-0.5" />
                    Next 30 days
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Occupancy Rate */}
        <div className="bg-white dark:bg-[#252525] overflow-hidden rounded border border-gray-200 dark:border-[#3b3b3b] transition-colors duration-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-2 rounded-full bg-[#0078d4]/10 text-[#0078d4]">
                  <Building2 className="h-5 w-5" />
                </div>
              </div>
              <div className="ml-4 flex-1">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Occupancy Rate
                </div>
                <div className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {summary.occupancyRate.toFixed(1)}%
                  </div>
                  <div className="ml-2 flex items-center text-xs font-medium text-green-500">
                    <ArrowUpRight className="h-3 w-3 mr-0.5" />
                    3.2%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Active Maintenance */}
        <div className="bg-white dark:bg-[#252525] overflow-hidden rounded border border-gray-200 dark:border-[#3b3b3b] transition-colors duration-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-500">
                  <Settings className="h-5 w-5" />
                </div>
              </div>
              <div className="ml-4 flex-1">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Active Maintenance
                </div>
                <div className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {summary.maintenanceRequests}
                  </div>
                  <div className="ml-2 flex items-center text-xs font-medium text-red-500">
                    <ArrowUpRight className="h-3 w-3 mr-0.5" />
                    8.1%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity Panel */}
        <div className="lg:col-span-2 bg-white dark:bg-[#252525] rounded border border-gray-200 dark:border-[#3b3b3b] transition-colors duration-200">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-[#3b3b3b] flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Activity</h3>
            <button className="text-sm text-[#0078d4] hover:text-[#106ebe] transition-colors duration-200">
              View all
            </button>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-[#3b3b3b]">
            {summary.recentActivity.map((activity, index) => (
              <div key={index} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-[#2d2d2d] transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-4">
                      {activity.type === 'payment' && <DollarSign className="h-5 w-5 text-green-500" />}
                      {activity.type === 'maintenance' && <Settings className="h-5 w-5 text-blue-500" />}
                      {activity.type === 'lease' && <FileText className="h-5 w-5 text-purple-500" />}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {activity.title}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {activity.tenant}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    {activity.amount && (
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatCurrency(activity.amount)}
                      </span>
                    )}
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(activity.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="space-y-6">

          {/* Upcoming Lease Endings */}
          <div className="bg-white dark:bg-[#252525] rounded border border-gray-200 dark:border-[#3b3b3b] transition-colors duration-200">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-[#3b3b3b]">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Upcoming Lease Endings</h3>
            </div>
            <div className="p-6 space-y-3">
              <div className="p-3 rounded bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium">Sarah Miller</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Unit 303, Sunset Apartments</p>
                  </div>
                  <span className="text-xs font-medium text-yellow-800 dark:text-yellow-300">
                    5 days left
                  </span>
                </div>
              </div>
              <div className="p-3 rounded bg-gray-50 dark:bg-[#1b1b1b] border border-gray-200 dark:border-[#3b3b3b]">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium">John Smith</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Unit 101, Lakeside Residence</p>
                  </div>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    14 days left
                  </span>
                </div>
              </div>
              <div className="p-3 rounded bg-gray-50 dark:bg-[#1b1b1b] border border-gray-200 dark:border-[#3b3b3b]">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium">Emily Johnson</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Unit 205, Park View Condos</p>
                  </div>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    21 days left
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}