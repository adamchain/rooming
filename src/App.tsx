
// src/App.tsx
import React from 'react';
import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calculator, DollarSign, PieChart, Users, Search, Bell, Plus, Home, Calendar, ShoppingCart } from 'lucide-react';
import Callback from './Callback'; // Import the separate Callback component

interface FinancialData {
  date: string;
  revenue: number;
  expenses: number;
}

// Use any for icon type as a simple workaround
interface StatCardProps {
  icon: any; // Use any for now to solve the TypeScript error
  title: string;
  value: string;
}

// Main App Component
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [financialData, setFinancialData] = useState<FinancialData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError,] = useState<string | null>(null);
  //const navigate = useNavigate();
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

      // Add realmId as query parameter if available
      const url = realmId
        ? `http://localhost:3000/api/quickbooks/financial-data?realmId=${realmId}`
        : 'http://localhost:3000/api/quickbooks/financial-data';

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
    window.location.href = 'http://localhost:3000/api/quickbooks/auth';
  };

  // Define StatCard as a React component using any for the icon type
  const StatCard: React.FC<StatCardProps> = ({ icon: Icon, title, value }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-teal-100 rounded-full">
          <Icon className="w-6 h-6 text-teal-600" />
        </div>
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <p className="text-2xl font-semibold text-gray-800">{value}</p>
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
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600"></div>
    </div>
  );

  // Sidebar link component
  const SidebarLink: React.FC<{ icon: any; label: string; active?: boolean }> = ({
    icon: Icon,
    label,
    active = false
  }) => (
    <div className={`flex flex-col items-center py-4 ${active ? 'text-teal-600' : 'text-gray-500'}`}>
      <Icon className="w-6 h-6 mb-1" />
      <span className="text-xs">{label}</span>
    </div>
  );

  // Login page component
  const LoginPage = () => (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full">
        <DollarSign className="w-16 h-16 text-teal-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-4">QuickBooks Integration</h1>
        <p className="text-gray-600 mb-6">Connect your QuickBooks account to view your financial dashboard</p>

        {error && <ErrorDisplay message={error} />}
        {isLoading && <LoadingDisplay />}

        {!isLoading && (
          <button
            onClick={handleQuickBooksLogin}
            className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors"
          >
            Connect QuickBooks
          </button>
        )}
      </div>
    </div>
  );

  // Dashboard component 
  const Dashboard = () => (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-24 bg-white shadow-sm flex flex-col items-center pt-5">
        <div className="mb-8 px-2">
          <h1 className="text-teal-600 text-3xl font-bold">QB API</h1>
        </div>
        <SidebarLink icon={Home} label="Home" active />
        <SidebarLink icon={Calendar} label="Revenue" />
        <SidebarLink icon={Users} label="Expenses" />
        <SidebarLink icon={ShoppingCart} label="Inventory" />
        <SidebarLink icon={DollarSign} label="Billing" />
      </div>

      {/* Main content */}
      <div className="flex-1">
        {/* Header */}
        <header className="bg-white shadow-sm p-4">
          <div className="flex justify-between items-center">
            <div className="relative w-96">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for invoices and expenses"
                className="pl-10 pr-4 py-2 bg-gray-100 rounded-full w-full focus:outline-none"
              />
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full bg-gray-100">
                <Bell className="h-6 w-6 text-gray-600" />
              </button>

              <button
                onClick={handleLogout}
                className="bg-red-100 text-red-600 px-3 py-1 rounded-md text-sm">
                Disconnect QB
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Financial Dashboard</h1>
            <button className="bg-teal-800 text-white px-4 py-2 rounded-full flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Create New
            </button>
          </div>

          {/* Financial Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={DollarSign}
              title="Revenue"
              value={`$${financialData.reduce((sum, data) => sum + data.revenue, 0).toLocaleString()}`}
            />
            <StatCard
              icon={Calculator}
              title="Expenses"
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
          <div className="bg-white p-6 rounded-lg shadow-sm w-full h-[500px]">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Revenue vs Expenses</h2>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={financialData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#0d9488" strokeWidth={2} />
                <Line type="monotone" dataKey="expenses" stroke="#dc2626" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </main>
      </div>
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