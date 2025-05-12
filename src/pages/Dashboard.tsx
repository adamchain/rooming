import React, { useState, useEffect } from 'react';
import MessageThread from '../components/MessageThread';
import PropertyMap from '../components/PropertyMap';
import { Building2, DollarSign, Wrench, FileText } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  
  // Demo data for initial render
  const [data, setData] = useState({
    tenants: [
      {
        id: '22222222-2222-2222-2222-222222222222',
        name: 'John Smith',
        email: 'tenant@test.com',
        property: {
          name: 'Sunset Apartments',
          address: '123 Main Street, Apt 4B'
        }
      }
    ],
    stats: {
      totalRent: 15000,
      pendingMaintenance: 3,
      occupancyRate: 92,
      documentsToReview: 2
    },
    properties: [
      {
        id: '1',
        name: 'Sunset Apartments',
        address: '123 Main Street, San Francisco, CA',
        occupancyRate: 92,
        maintenanceRequests: 2
      },
      {
        id: '2',
        name: 'Ocean View Condos',
        address: '456 Beach Road, San Francisco, CA',
        occupancyRate: 88,
        maintenanceRequests: 1
      },
      {
        id: '3',
        name: 'Mountain Lodge',
        address: '789 Pine Street, San Francisco, CA',
        occupancyRate: 95,
        maintenanceRequests: 0
      }
    ]
  });

  if (!user?.id) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-[#202020]">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Please sign in</h2>
          <p className="text-gray-600 dark:text-gray-400">You need to be signed in to view the dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white dark:bg-[#252525] overflow-hidden rounded-lg border border-gray-200 dark:border-[#3b3b3b] p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-[#0078d4]/10 rounded-full p-3">
              <DollarSign className="h-6 w-6 text-[#0078d4]" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Monthly Rent</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatCurrency(data.stats.totalRent)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#252525] overflow-hidden rounded-lg border border-gray-200 dark:border-[#3b3b3b] p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-orange-100 dark:bg-orange-900/20 rounded-full p-3">
              <Wrench className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Maintenance</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{data.stats.pendingMaintenance}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#252525] overflow-hidden rounded-lg border border-gray-200 dark:border-[#3b3b3b] p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-100 dark:bg-green-900/20 rounded-full p-3">
              <Building2 className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Occupancy Rate</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{data.stats.occupancyRate}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#252525] overflow-hidden rounded-lg border border-gray-200 dark:border-[#3b3b3b] p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-purple-100 dark:bg-purple-900/20 rounded-full p-3">
              <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Documents to Review</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{data.stats.documentsToReview}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Property Map */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Property Overview</h2>
        <PropertyMap properties={data.properties} />
      </div>

      {/* Messages Section */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Messages</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.tenants.map((tenant) => (
            <div key={tenant.id} className="bg-white dark:bg-[#252525] rounded-lg border border-gray-200 dark:border-[#3b3b3b] p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">{tenant.name}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{tenant.property?.name || tenant.property?.address}</p>
                </div>
              </div>
              <MessageThread 
                receiverId={tenant.id} 
                receiverEmail={tenant.email}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}