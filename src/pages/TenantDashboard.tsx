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
  X,
  Users,
  Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/formatters';
import MessageThread from '../components/MessageThread';
import RentPaymentForm from '../components/RentPaymentForm';
import MaintenanceChat from '../components/MaintenanceChat';
import RoommateManager from '../components/RoommateManager';
import Documents from '../pages/Documents';
import Maintenance from '../pages/Maintenance';

// Mock payment history data
const MOCK_PAYMENT_HISTORY = [
  {
    id: '1',
    date: '2024-04-01',
    amount: 1250,
    status: 'paid',
    type: 'Rent Payment',
    reference: 'APR-2024'
  },
  {
    id: '2',
    date: '2024-03-01',
    amount: 1250,
    status: 'paid',
    type: 'Rent Payment',
    reference: 'MAR-2024'
  },
  {
    id: '3',
    date: '2024-02-01',
    amount: 1250,
    status: 'paid',
    type: 'Rent Payment',
    reference: 'FEB-2024'
  }
];

export default function TenantDashboard() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [activeSection, setActiveSection] = useState('home');
  const [showMaintenanceChat, setShowMaintenanceChat] = useState(false);
  const [showMaintenanceForm, setShowMaintenanceForm] = useState(false);
  const [message, setMessage] = useState('');
  const [newRequest, setNewRequest] = useState({
    title: '',
    description: '',
    priority: 'medium'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [darkMode, setDarkMode] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showRoommateModal, setShowRoommateModal] = useState(false);

  // Demo data
  const [data, setData] = useState({
    name: 'Demo Tenant',
    property: {
      id: 'prop123',
      name: 'Sunset Apartments',
      address: '123 Main Street, Anytown USA',
      lease_start: '2024-01-01',
      lease_end: '2025-01-01',
      rent_amount: 1250,
      user_id: '11111111-1111-1111-1111-111111111111' // Landlord's ID
    },
    tenant: {
      id: 'tenant123'
    }
  });

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);

    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());

    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLogout = async () => {
    if (signOut) {
      await signOut();
    }
    navigate('/');
  };

  const handleSectionClick = (section) => {
    setActiveSection(section);
    setSidebarOpen(false);
  };

  const getNextPaymentDate = () => {
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    return nextMonth.toLocaleDateString();
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const handleSplitPayment = (roommates) => {
    setShowRoommateModal(false);
    setShowPaymentModal(true);
  };

  const renderPaymentsSection = () => {
    return (
      <div className="space-y-6">
        {/* Next Payment Card */}
        <div className="bg-white dark:bg-[#252525] rounded-lg border border-gray-200 dark:border-[#3b3b3b] p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Next Payment Due</p>
              <p className="text-2xl font-semibold text-[#0078d4]">
                {formatCurrency(data.property.rent_amount)}
              </p>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => setShowRoommateModal(true)}
                className="px-4 py-2 bg-white dark:bg-[#1b1b1b] text-[#0078d4] border border-[#0078d4] rounded hover:bg-[#0078d4] hover:text-white text-sm font-medium transition-colors flex items-center"
              >
                <Users className="h-4 w-4 mr-2" />
                Split with Roommates
              </button>
              <button 
                onClick={() => setShowPaymentModal(true)}
                className="px-4 py-2 bg-[#0078d4] text-white rounded hover:bg-[#106ebe] text-sm font-medium"
              >
                Make Payment
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Due on {getNextPaymentDate()}</p>
        </div>

        {/* Payment History */}
        <div className="bg-white dark:bg-[#252525] rounded-lg border border-gray-200 dark:border-[#3b3b3b] overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-[#3b3b3b]">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Payment History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-[#3b3b3b]">
              <thead className="bg-gray-50 dark:bg-[#1b1b1b]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Reference</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-[#252525] divide-y divide-gray-200 dark:divide-[#3b3b3b]">
                {MOCK_PAYMENT_HISTORY.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-[#2d2d2d] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {new Date(payment.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {payment.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {payment.reference}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        payment.status === 'paid' 
                          ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300'
                          : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300'
                      }`}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderHomeSection = () => {
    return (
      <>
        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
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

        {/* Next Payment */}
        <div className="bg-white dark:bg-[#252525] rounded-lg border border-gray-200 dark:border-[#3b3b3b] p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Next Payment Due</p>
              <p className="text-2xl font-semibold text-[#0078d4]">
                {formatCurrency(data.property.rent_amount)}
              </p>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => setShowRoommateModal(true)}
                className="px-4 py-2 bg-white dark:bg-[#1b1b1b] text-[#0078d4] border border-[#0078d4] rounded hover:bg-[#0078d4] hover:text-white text-sm font-medium transition-colors flex items-center"
              >
                <Users className="h-4 w-4 mr-2" />
                Split with Roommates
              </button>
              <button 
                onClick={() => setShowPaymentModal(true)}
                className="px-4 py-2 bg-[#0078d4] text-white rounded hover:bg-[#106ebe] text-sm font-medium"
              >
                Make Payment
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Due on {getNextPaymentDate()}</p>
        </div>

        {/* Property Overview */}
        <div className="bg-white dark:bg-[#252525] rounded-lg border border-gray-200 dark:border-[#3b3b3b] p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Property Overview</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Property</p>
              <p className="font-medium">{data.property.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
              <p className="font-medium">{data.property.address}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Lease Period</p>
              <p className="font-medium">
                {new Date(data.property.lease_start).toLocaleDateString()} to{' '}
                {new Date(data.property.lease_end).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Monthly Rent</p>
              <p className="font-medium text-[#0078d4]">{formatCurrency(data.property.rent_amount)}</p>
            </div>
          </div>
        </div>

        {/* Message Thread */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Send Non-Urgent Message</h2>
          <MessageThread 
            receiverId={data.property.user_id}
            receiverEmail="Property Manager"
          />
        </div>
      </>
    );
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'home':
        return renderHomeSection();
      case 'payments':
        return renderPaymentsSection();
      case 'maintenance':
        return <Maintenance />;
      case 'documents':
        return <Documents />;
      default:
        return renderHomeSection();
    }
  };

  const navigationItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'payments', icon: CreditCard, label: 'Payments' },
    { id: 'maintenance', icon: Wrench, label: 'Maintenance' },
    { id: 'documents', icon: FileText, label: 'Documents' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#202020] text-gray-900 dark:text-gray-200 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-[#1b1b1b] border-b border-gray-200 dark:border-[#3b3b3b] sticky top-0 z-50 transition-colors duration-200">
        <div className="mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center">
              <button
                className="md:hidden mr-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <Menu size={24} />
              </button>
              <img src="/logo-nobg.png" alt="Rooming" className="h-8 w-8 invert" />
              <span className="text-xl font-medium text-gray-900 dark:text-white">Rooming</span>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={toggleDarkMode}
                className="p-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-full hover:bg-gray-200 dark:hover:bg-[#292929] transition-colors"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <button className="p-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-full hover:bg-gray-200 dark:hover:bg-[#292929] transition-colors">
                <Bell size={20} />
              </button>

              <div className="h-8 w-8 rounded-full bg-[#0078d4] flex items-center justify-center text-white font-medium">
                {data.name.charAt(0)}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-3.5rem)]">
        {/* Sidebar for mobile - when open */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50" onClick={() => setSidebarOpen(false)}></div>
            <div className="relative flex flex-col w-72 max-w-xs bg-white dark:bg-[#1b1b1b] h-full border-r border-gray-200 dark:border-[#3b3b3b] transition-colors duration-200">
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-[#3b3b3b]">
                <div className="flex items-center">
                  <img src="/rooming-logo.png" alt="Rooming" className="h-8 w-8" />
                  <span className="ml-3 text-xl font-medium text-gray-900 dark:text-white">Rooming</span>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSectionClick(item.id)}
                    className={`flex items-center w-full px-3 py-2 text-left rounded-md transition-colors ${
                      activeSection === item.id
                        ? 'bg-[#0078d4]/10 text-[#0078d4]'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#292929]'
                    }`}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="p-4 border-t border-gray-200 dark:border-[#3b3b3b]">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-3 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#292929] rounded-md transition-colors"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sidebar - desktop permanent */}
        <div className="hidden md:flex flex-col w-64 border-r border-gray-200 dark:border-[#3b3b3b] bg-white dark:bg-[#1b1b1b] transition-colors duration-200">
          <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSectionClick(item.id)}
                className={`flex items-center w-full px-3 py-2 text-left rounded-md transition-colors ${
                  activeSection === item.id
                    ? 'bg-[#0078d4]/10 text-[#0078d4]'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#292929]'
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.label}
              </button>
            ))}
          </div>

          <div className="p-3 border-t border-gray-200 dark:border-[#3b3b3b]">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#292929] rounded-md transition-colors"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Sign Out
            </button>
          </div>
        </div>

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

            {/* Render active section */}
            {renderSection()}

            {/* Payment Modal */}
            {showPaymentModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white dark:bg-[#252525] rounded-lg p-6 max-w-md w-full relative">
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-5 w-5" />
                  </button>
                  <RentPaymentForm
                    amount={data.property.rent_amount}
                    onSuccess={() => {
                      setShowPaymentModal(false);
                    }}
                    onError={(error) => {
                      console.error('Payment error:', error);
                    }}
                    setupRecurring={true}
                  />
                </div>
              </div>
            )}

            {/* Roommate Modal */}
            {showRoommateModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white dark:bg-[#252525] rounded-lg p-6 max-w-4xl w-full relative">
                  <button
                    onClick={() => setShowRoommateModal(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-5 w-5" />
                  </button>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Split Rent with Roommates</h2>
                  <RoommateManager
                    tenantId={data.tenant.id}
                    rentAmount={data.property.rent_amount}
                    onSplitPayment={handleSplitPayment}
                  />
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}