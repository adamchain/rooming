// src/App.tsx
import React from 'react';
import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calculator, DollarSign, PieChart, Users, ChartBar } from 'lucide-react';
import Callback from './Callback'; // Import the separate Callback component

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
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [financialData, setFinancialData] = useState<FinancialData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError,] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    // Only handle token check on the main page, not on callback
    if (location.pathname !== '/callback') {
      // Check if we have a valid token
      const token = localStorage.getItem('quickbooks_token');
      if (token) {
        setIsAuthenticated(true);
        fetchFinancialData();
      }
    }
  }, [location.pathname]);

  // Keep your existing function for fetching financial data
  const fetchFinancialData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem('quickbooks_token');
      if (!token) {
        setError("No QuickBooks token found");
        setIsLoading(false);
        return;
      }

      const realmId = localStorage.getItem('quickbooks_realm_id');
      console.log("Using realmId:", realmId);

      const url = realmId
        ? `https://quickbooks-server-production.up.railway.app/api/quickbooks/financial-data?realmId=${realmId}`
        : 'https://quickbooks-server-production.up.railway.app/api/quickbooks/financial-data';

      console.log("Fetching financial data from:", url);

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        let errorMessage = `Failed to fetch financial data: ${response.status}`;

        try {
          // Try to parse error details from the response
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
          if (errorData.details) {
            errorMessage += ` - ${errorData.details}`;
          }
        } catch (e) {
          // If we can't parse JSON, just use the status text
          errorMessage = `Failed to fetch financial data: ${response.status} ${response.statusText}`;
        }

        if (response.status === 401) {
          // Handle authentication errors
          localStorage.removeItem('quickbooks_token');
          setIsAuthenticated(false);
          errorMessage = "Your QuickBooks session has expired. Please reconnect.";
        }

        setError(errorMessage);
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      console.log("Financial data received:", data.length, "months");

      if (!Array.isArray(data) || data.length === 0) {
        setError("No financial data available");
        setFinancialData([]);
      } else {
        setFinancialData(data);
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching QuickBooks data:', error);
      const errorMessage = error instanceof Error
        ? error.message
        : 'Unknown error loading financial data';

      setError(`Error loading financial data: ${errorMessage}`);
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('quickbooks_token');
    localStorage.removeItem('quickbooks_refresh_token');
    localStorage.removeItem('quickbooks_realm_id');
    setIsAuthenticated(false);
  };

  const handleQuickBooksLogin = () => {
    // Direct to the backend auth endpoint
    //window.location.href = 'https://rooming-qb.netlify.app/api/quickbooks/auth';
    window.location.href = 'https://quickbooks-server-production.up.railway.app/api/quickbooks/auth';

  };

  // Define StatCard as a React component using any for the icon type
  const StatCard: React.FC<StatCardProps> = ({ icon: Icon, title, value }) => (
    <div className="bg-white p-4 rounded border">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gray-100 rounded">
          <Icon className="w-5 h-5 text-gray-700" />
        </div>
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <p className="text-xl font-semibold text-gray-800">{value}</p>
        </div>
      </div>
    </div>
  );

  // Error display component
  const ErrorDisplay: React.FC<{ message: string }> = ({ message }) => (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      <p>{message}</p>
    </div>
  );

  // Loading display component
  const LoadingDisplay: React.FC = () => (
    <div className="flex justify-center items-center h-20">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-700"></div>
    </div>
  );

  // Login page component
  const LoginPage = () => (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded shadow-md max-w-md w-full">
        <div className="text-center mb-6">
          <ChartBar className="w-12 h-12 text-gray-700 mx-auto mb-3" />
          <h1 className="text-2xl font-bold mb-2">QuickBooks Integration</h1>
          <p className="text-gray-600">Connect your QuickBooks account to view your financial data</p>
        </div>

        {error && <ErrorDisplay message={error} />}
        {isLoading && <LoadingDisplay />}

        {!isLoading && (
          <button
            onClick={handleQuickBooksLogin}
            className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
          >
            Connect QuickBooks
          </button>
        )}
      </div>
    </div>
  );

  // Dashboard component with simplified UI
  const Dashboard = () => (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">QuickBooks Financial Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-300">
            Disconnect QuickBooks
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto p-4">
        {error && <ErrorDisplay message={error} />}
        {isLoading ? (
          <LoadingDisplay />
        ) : (
          <>
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
            <div className="bg-white p-4 rounded border mb-6">
              <h2 className="text-lg font-semibold mb-4">Revenue vs Expenses</h2>
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
            <div className="bg-white p-4 rounded border">
              <h2 className="text-lg font-semibold mb-4">Monthly Financial Data</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expenses</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profit</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {financialData.map((month, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">{month.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap">${month.revenue.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap">${month.expenses.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap">${(month.revenue - month.expenses).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );

  // Routes structure
  return (
    <Routes>
      <Route path="/callback" element={<Callback />} />
      <Route path="/" element={isAuthenticated ? <Dashboard /> : <LoginPage />} />
    </Routes>
  );
}

export default App;