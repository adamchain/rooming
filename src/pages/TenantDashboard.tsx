import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RentPaymentForm from '../components/RentPaymentForm';
import TenantActivityFeed from '../components/TenantActivityFeed';
import { Building2, CreditCard, Wrench, FileText, Bell, LogOut, Home } from 'lucide-react';

export default function TenantDashboard() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState({
    name: 'Demo Tenant',
    property: {
      name: 'Sunset Apartments',
      address: '123 Main Street, Apt 4B',
      rent_amount: 1500
    },
    activities: [
      {
        id: '1',
        type: 'payment',
        title: 'Rent Payment',
        description: 'Monthly rent payment processed',
        status: 'completed',
        amount: 1500,
        created_at: new Date().toISOString()
      }
    ]
  });

  const handleSignOut = async () => {
    if (signOut) {
      await signOut();
      navigate('/');
    }
  };

  const navigationItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'rent', icon: CreditCard, label: 'Pay Rent' },
    { id: 'maintenance', icon: Wrench, label: 'Maintenance' },
    { id: 'documents', icon: FileText, label: 'Documents' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'rent':
        return (
          <div className="flex justify-center">
            <RentPaymentForm
              amount={data.property.rent_amount}
              onSuccess={() => {
                alert('Rent payment successful!');
              }}
              onError={(error) => setError(error)}
              setupRecurring
            />
          </div>
        );
      case 'home':
      default:
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Property Details</h2>
              <div className="space-y-2">
                <p><span className="font-medium">Property:</span> {data.property.name}</p>
                <p><span className="font-medium">Address:</span> {data.property.address}</p>
                <p><span className="font-medium">Monthly Rent:</span> ${data.property.rent_amount}</p>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
              <TenantActivityFeed activities={data.activities} />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">
                Tenant Portal
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                <Bell className="h-6 w-6" />
              </button>
              <button
                onClick={handleSignOut}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <LogOut className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-4">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                  activeTab === item.id
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                }`}
              >
                <item.icon className="h-5 w-5 mr-2" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <div className="ml-3">
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        {renderContent()}
      </div>
    </div>
  );
}