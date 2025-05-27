import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calculator, DollarSign, PieChart, Users, BarChart as ChartBar } from 'lucide-react';

interface FinancialData {
  date: string;
  revenue: number;
  expenses: number;
}

// StatCard component with simplified styling
interface StatCardProps {
  icon: any;
  title: string;
  value: string;
}

// Main App Component
function QuickbooksIntegration() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [financialData, setFinancialData] = useState<FinancialData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Mock financial data
    const mockData = [
      { date: 'Jan', revenue: 65000, expenses: 45000 },
      { date: 'Feb', revenue: 59000, expenses: 40000 },
      { date: 'Mar', revenue: 80000, expenses: 55000 },
      { date: 'Apr', revenue: 81000, expenses: 56000 },
      { date: 'May', revenue: 56000, expenses: 40000 },
      { date: 'Jun', revenue: 55000, expenses: 40000 },
      { date: 'Jul', revenue: 40000, expenses: 30000 },
      { date: 'Aug', revenue: 45000, expenses: 35000 },
      { date: 'Sep', revenue: 60000, expenses: 45000 },
      { date: 'Oct', revenue: 70000, expenses: 50000 },
      { date: 'Nov', revenue: 90000, expenses: 65000 },
      { date: 'Dec', revenue: 100000, expenses: 70000 },
    ];
    
    setFinancialData(mockData);
    setIsAuthenticated(true);
  }, []);

  const handleConnect = () => {
    setIsAuthenticated(true);
  };

  // Define StatCard as a React component using any for the icon type
  const StatCard: React.FC<StatCardProps> = ({ icon: Icon, title, value }) => (
    <div className="bg-white dark:bg-[#252525] p-4 rounded border dark:border-[#3b3b3b]">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gray-100 dark:bg-[#1b1b1b] rounded">
          <Icon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </div>
        <div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">{title}</p>
          <p className="text-xl font-semibold text-gray-800 dark:text-white">{value}</p>
        </div>
      </div>
    </div>
  );

  // Error display component
  const ErrorDisplay: React.FC<{ message: string }> = ({ message }) => (
    <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-4">
      <p>{message}</p>
    </div>
  );

  // Loading display component
  const LoadingDisplay: React.FC = () => (
    <div className="flex justify-center items-center h-20">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-700 dark:border-gray-300"></div>
    </div>
  );

  // Login page component
  const LoginPage = () => (
    <div className="bg-white dark:bg-[#252525] p-8 rounded-lg shadow-md max-w-md mx-auto">
      <div className="text-center mb-6">
        <ChartBar className="w-12 h-12 text-gray-700 dark:text-gray-300 mx-auto mb-3" />
        <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">QuickBooks Integration</h1>
        <p className="text-gray-600 dark:text-gray-400">Connect your QuickBooks account to view your financial data</p>
      </div>

      {error && <ErrorDisplay message={error} />}
      {isLoading && <LoadingDisplay />}

      {!isLoading && (
        <button
          onClick={handleConnect}
          className="w-full bg-green-600 dark:bg-green-700 text-white px-4 py-2 rounded hover:bg-green-700 dark:hover:bg-green-800 transition-colors"
        >
          Connect QuickBooks
        </button>
      )}
    </div>
  );

  // Dashboard component with simplified UI
  const Dashboard = () => (
    <div>
      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={DollarSign}
          title="Total Revenue"
          value={`$${financialData.reduce((sum, data) => sum + data.revenue, 0).toLocaleString()}`}
        />
        <StatCard
          icon={Calculator}
          title="Total Expenses"
          value={`$${financialData.reduce((sum, data) => sum + data.expenses, 0).toLocaleString()}`}
        />
        <StatCard
          icon={PieChart}
          title="Profit Margin"
          value={`${((financialData.reduce((sum, data) => sum + data.revenue - data.expenses, 0) /
            (financialData.reduce((sum, data) => sum + data.revenue, 0) || 1)) * 100).toFixed(1)}%`}
        />
        <StatCard
          icon={Users}
          title="Period"
          value="2024"
        />
      </div>

      {/* Financial Chart */}
      <div className="bg-white dark:bg-[#252525] p-4 rounded border dark:border-[#3b3b3b] mb-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Revenue vs Expenses</h2>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={financialData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} />
              <Line type="monotone" dataKey="expenses" stroke="#dc2626" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white dark:bg-[#252525] p-4 rounded border dark:border-[#3b3b3b]">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Monthly Financial Data</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-[#1b1b1b]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Month</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Expenses</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Profit</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-[#252525] divide-y divide-gray-200 dark:divide-gray-700">
              {financialData.map((month, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-[#2d2d2d]">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">{month.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">${month.revenue.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">${month.expenses.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">${(month.revenue - month.expenses).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">QuickBooks Financial Dashboard</h1>
      {isAuthenticated ? <Dashboard /> : <LoginPage />}
    </div>
  );
}

export default QuickbooksIntegration;