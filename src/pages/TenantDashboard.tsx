import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import {
  Building2,
  CreditCard,
  Wrench,
  FileText,
  Bell,
  LogOut,
  Send,
  MessageSquare,
  Upload,
  Moon,
  Sun,
  Menu,
  Home,
  ChevronRight,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/formatters';
import MessageThread from '../components/MessageThread';
import RentPaymentForm from '../components/RentPaymentForm';

// Rest of the imports...

export default function TenantDashboard() {
  // Existing state...
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  // Message handling is now moved to MessageThread component
  const handlePaymentSuccess = () => {
    setShowPaymentForm(false);
    // Refresh data or show success message
  };

  const handlePaymentError = (error: string) => {
    setError(error);
  };

  // Update the renderContent function to use MessageThread
  function renderContent() {
    if (activeSection === 'maintenance') {
      if (showMaintenanceChat) {
        return renderMaintenanceChat();
      } else if (showMaintenanceForm) {
        return renderMaintenanceForm();
      } else {
        return renderMaintenanceOptions();
      }
    }

    switch (activeSection) {
      case 'home':
        return renderHomeSection();
      case 'payments':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Payment Information</h3>
            {showPaymentForm ? (
              <RentPaymentForm
                amount={data.property.rent_amount}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                setupRecurring={true}
              />
            ) : (
              <div className="bg-white dark:bg-[#252525] rounded border border-gray-200 dark:border-[#3b3b3b] p-6">
                <div className="mb-6">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Next Payment Due</p>
                  <p className="text-2xl font-semibold text-[#0078d4]">
                    {formatCurrency(data.property.rent_amount)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Due on {getNextPaymentDate()}
                  </p>
                </div>
                <button
                  onClick={() => setShowPaymentForm(true)}
                  className="w-full py-2 bg-[#0078d4] text-white rounded hover:bg-[#106ebe] text-sm font-medium"
                >
                  Make Payment
                </button>
              </div>
            )}
          </div>
        );
      case 'documents':
        return renderDocumentUpload();
      default:
        return renderHomeSection();
    }
  }

  // Rest of the component code...

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#202020] text-gray-900 dark:text-gray-200 transition-colors duration-200">
      {/* Header and navigation code... */}

      <div className="flex h-[calc(100vh-3.5rem)]">
        {/* Sidebar code... */}

        {/* Main content area */}
        <div className="flex-1 overflow-y-auto">
          <main className="max-w-4xl mx-auto px-4 py-6">
            {/* Welcome banner */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {getGreeting()}, {data.name.split(' ')[0]}
                </h1>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Welcome to your tenant dashboard
              </p>
            </div>

            {/* Message Thread */}
            <div className="mb-8">
              <MessageThread 
                receiverId={data.property.user_id}
                receiverEmail="Property Manager"
              />
            </div>

            {/* Quick Actions */}
            {activeSection === 'home' && (
              <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSectionClick(item.id)}
                    className="flex flex-col items-center justify-center p-4 bg-white dark:bg-[#252525] border border-gray-200 dark:border-[#3b3b3b] rounded-md hover:border-[#0078d4] dark:hover:border-[#0078d4] transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#0078d4]/10 flex items-center justify-center mb-2">
                      <item.icon className="h-5 w-5 text-[#0078d4]" />
                    </div>
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Main content based on active section */}
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
}