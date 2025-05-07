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
  ArrowDownRight
} from 'lucide-react';
import tenantService from '../services/tenantService';
import invoiceService from '../services/invoiceService';
import { formatCurrency } from '../utils/formatters';
import { addDays, isAfter, isBefore } from 'date-fns';

interface DashboardSummary {
  overdueRent: number;
  upcomingLeaseEnds: number;
  maintenanceRequests: number;
  occupancyRate: number;
  recentActivity: Array<{
    type: string;
    title: string;
    date: string;
    amount?: number;
  }>;
}

export default function Dashboard() {
  const [summary, setSummary] = useState<DashboardSummary>({
    overdueRent: 0,
    upcomingLeaseEnds: 0,
    maintenanceRequests: 0,
    occupancyRate: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [tenants, invoices] = await Promise.all([
        tenantService.getTenants(),
        invoiceService.getInvoices()
      ]);

      // Calculate overdue rent
      const overdueAmount = invoices
        .filter(inv => inv.status === 'overdue')
        .reduce((sum, inv) => sum + inv.total, 0);

      // Calculate upcoming lease ends (next 30 days)
      const thirtyDaysFromNow = addDays(new Date(), 30);
      const upcomingEnds = tenants.filter(tenant => 
        isBefore(new Date(tenant.lease_end), thirtyDaysFromNow)
      ).length;

      // Calculate occupancy rate
      const occupiedUnits = tenants.length;
      const totalUnits = tenants.reduce((units, tenant) => {
        if (!tenant.property) return units;
        return units + 1;
      }, 0);
      const occupancyRate = totalUnits ? (occupiedUnits / totalUnits) * 100 : 0;

      setSummary({
        overdueRent: overdueAmount,
        upcomingLeaseEnds: upcomingEnds,
        maintenanceRequests: 3, // Mock data for now
        occupancyRate,
        recentActivity: [
          {
            type: 'payment',
            title: 'Rent Payment Received',
            date: '2024-04-30',
            amount: 1500
          },
          {
            type: 'maintenance',
            title: 'New Maintenance Request',
            date: '2024-04-29'
          },
          {
            type: 'lease',
            title: 'Lease Ending Soon',
            date: '2024-05-15'
          }
        ]
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>

      {/* Alert Section */}
      {summary.overdueRent > 0 && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <AlertTriangle className="h-6 w-6 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Attention Required
              </h3>
              <p className="mt-1 text-sm text-red-700">
                You have {formatCurrency(summary.overdueRent)} in overdue rent payments
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden rounded-lg shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500">
                    Overdue Rent
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {formatCurrency(summary.overdueRent)}
                    </div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-red-600">
                      <ArrowUpRight className="h-4 w-4" />
                      12.5%
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden rounded-lg shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500">
                    Leases Ending Soon
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {summary.upcomingLeaseEnds}
                    </div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-yellow-600">
                      <Clock className="h-4 w-4" />
                      Next 30 days
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden rounded-lg shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Building2 className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500">
                    Occupancy Rate
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {summary.occupancyRate.toFixed(1)}%
                    </div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                      <ArrowUpRight className="h-4 w-4" />
                      3.2%
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden rounded-lg shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-purple-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500">
                    Active Maintenance
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {summary.maintenanceRequests}
                    </div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-purple-600">
                      <ArrowDownRight className="h-4 w-4" />
                      8.1%
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {summary.recentActivity.map((activity, index) => (
            <div key={index} className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="text-sm font-medium text-indigo-600 truncate">
                    {activity.title}
                  </div>
                </div>
                <div className="ml-2 flex-shrink-0 flex">
                  {activity.amount && (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {formatCurrency(activity.amount)}
                    </span>
                  )}
                  <span className="ml-2 text-sm text-gray-500">
                    {new Date(activity.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}