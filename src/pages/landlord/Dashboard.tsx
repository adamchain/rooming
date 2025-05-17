import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Users, CreditCard, DollarSign, ArrowUpRight, LogOut, PieChart } from 'lucide-react';
import { gettrxApi, Payment } from '../../services/gettrx';

const mockTransactions = [
  { id: '1', amount: 1200, status: 'succeeded', date: '2023-04-01', tenant: 'John Smith' },
  { id: '2', amount: 950, status: 'succeeded', date: '2023-04-02', tenant: 'Sarah Johnson' },
  { id: '3', amount: 1500, status: 'succeeded', date: '2023-04-03', tenant: 'Michael Brown' },
  { id: '4', amount: 800, status: 'pending', date: '2023-04-05', tenant: 'Emily Davis' },
  { id: '5', amount: 1100, status: 'failed', date: '2023-04-06', tenant: 'David Wilson' }
];

const LandlordDashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]);
  const navigate = useNavigate();
  
  // Load transactions (using mock data for demo)
  React.useEffect(() => {
    setTimeout(() => {
      setTransactions(mockTransactions);
      setIsLoading(false);
    }, 1000);
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('landlord_email');
    localStorage.removeItem('merchant_id');
    navigate('/landlord/login');
  };
  
  // Calculate summary statistics
  const totalRevenue = transactions.reduce((sum, tx) => 
    tx.status === 'succeeded' ? sum + tx.amount : sum, 0
  );
  
  const pendingRevenue = transactions.reduce((sum, tx) => 
    tx.status === 'pending' ? sum + tx.amount : sum, 0
  );
  
  const tenantCount = new Set(transactions.map(tx => tx.tenant)).size;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Landlord Dashboard</h1>
            <p className="text-gray-600">
              Welcome back, {localStorage.getItem('landlord_email')?.split('@')[0] || 'Landlord'}
            </p>
          </div>
          
          <button
            onClick={handleLogout}
            className="mt-4 md:mt-0 flex items-center text-gray-700 hover:text-red-600"
          >
            <LogOut className="h-4 w-4 mr-1" />
            Logout
          </button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="bg-green-100 p-3 rounded-full">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
                    <p className="text-2xl font-semibold text-gray-900">${totalRevenue.toLocaleString()}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-green-600">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  <span>12% from last month</span>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <CreditCard className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">Pending Payments</h3>
                    <p className="text-2xl font-semibold text-gray-900">${pendingRevenue.toLocaleString()}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-yellow-600">
                  <span>1 payment processing</span>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">Active Tenants</h3>
                    <p className="text-2xl font-semibold text-gray-900">{tenantCount}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-purple-600">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  <span>2 new this month</span>
                </div>
              </div>
            </div>
            
            {/* Recent Transactions */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
                <button 
                  onClick={() => navigate('/landlord/payments')}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  View all
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tenant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {transactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{transaction.tenant}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">${transaction.amount.toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{transaction.date}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                            ${transaction.status === 'succeeded' ? 'bg-green-100 text-green-800' : ''}
                            ${transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                            ${transaction.status === 'failed' ? 'bg-red-100 text-red-800' : ''}
                          `}>
                            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => navigate('/landlord/payments')}
                    className="flex flex-col items-center justify-center bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium py-6 px-4 rounded-lg transition-colors"
                  >
                    <CreditCard className="h-6 w-6 mb-2" />
                    <span>Process Payment</span>
                  </button>
                  
                  <button
                    onClick={() => navigate('/landlord/customers')}
                    className="flex flex-col items-center justify-center bg-purple-50 hover:bg-purple-100 text-purple-600 font-medium py-6 px-4 rounded-lg transition-colors"
                  >
                    <Users className="h-6 w-6 mb-2" />
                    <span>Manage Tenants</span>
                  </button>
                  
                  <button
                    className="flex flex-col items-center justify-center bg-green-50 hover:bg-green-100 text-green-600 font-medium py-6 px-4 rounded-lg transition-colors"
                  >
                    <BarChart className="h-6 w-6 mb-2" />
                    <span>View Reports</span>
                  </button>
                  
                  <button
                    className="flex flex-col items-center justify-center bg-red-50 hover:bg-red-100 text-red-600 font-medium py-6 px-4 rounded-lg transition-colors"
                  >
                    <PieChart className="h-6 w-6 mb-2" />
                    <span>Analytics</span>
                  </button>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Successful Payments</span>
                    <span className="font-medium text-gray-900">
                      {transactions.filter(t => t.status === 'succeeded').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Pending Payments</span>
                    <span className="font-medium text-gray-900">
                      {transactions.filter(t => t.status === 'pending').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Failed Payments</span>
                    <span className="font-medium text-gray-900">
                      {transactions.filter(t => t.status === 'failed').length}
                    </span>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-800 font-medium">Total Revenue</span>
                      <span className="font-semibold text-gray-900">${totalRevenue.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LandlordDashboard;