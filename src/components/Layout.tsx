import React, { useState, useEffect } from 'react';
import { Bell, Menu, X, Home, Building2, Users, Wrench, FileText, CreditCard, DollarSign, Phone, LogOut } from 'lucide-react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navigationItems = [
  { id: 'dashboard', icon: Home, label: 'Dashboard', path: '/dashboard' },
  { id: 'properties', icon: Building2, label: 'Properties', path: '/dashboard/properties' },
  { id: 'tenants', icon: Users, label: 'Tenants', path: '/dashboard/tenants' },
  { id: 'maintenance', icon: Wrench, label: 'Maintenance', path: '/dashboard/maintenance' },
  { id: 'documents', icon: FileText, label: 'Documents', path: '/dashboard/documents' },
  { id: 'payments', icon: CreditCard, label: 'Payments', path: '/dashboard/payments' },
  { id: 'financials', icon: DollarSign, label: 'Financials', path: '/dashboard/financials' },
  { id: 'contacts', icon: Phone, label: 'Contacts', path: '/dashboard/contacts' }
];

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#202020]">
      {/* Header */}
      <header className="bg-white dark:bg-[#1b1b1b] border-b border-gray-200 dark:border-[#3b3b3b] sticky top-0 z-50">
        <div className="mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-[#252525]"
              >
                <Menu className="h-6 w-6" />
              </button>
              <img src="/logo-nobg.png" alt="Rooming" className="h-8 w-8 invert" />
              <span className="ml-2 text-xl font-medium text-gray-900 dark:text-white">Rooming</span>
            </div>

            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-[#252525] rounded-full">
                <Bell className="h-6 w-6" />
                {unreadMessages > 0 && (
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar for mobile */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-[#1b1b1b]">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X className="h-6 w-6 text-white" />
                </button>
              </div>
              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <nav className="mt-5 px-2 space-y-1">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.id}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                        location.pathname === item.path
                          ? 'bg-gray-100 dark:bg-[#252525] text-[#0078d4]'
                          : 'text-gray-600 hover:bg-gray-50 dark:hover:bg-[#252525] dark:text-gray-300'
                      }`}
                    >
                      <item.icon className="mr-4 h-6 w-6" />
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </div>
              <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-[#3b3b3b] p-4">
                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#252525] w-full rounded-md"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Static sidebar for desktop */}
        <div className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64">
            <div className="flex flex-col h-0 flex-1 border-r border-gray-200 dark:border-[#3b3b3b] bg-white dark:bg-[#1b1b1b]">
              <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                <nav className="mt-5 flex-1 px-2 space-y-1">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.id}
                      to={item.path}
                      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                        location.pathname === item.path
                          ? 'bg-gray-100 dark:bg-[#252525] text-[#0078d4]'
                          : 'text-gray-600 hover:bg-gray-50 dark:hover:bg-[#252525] dark:text-gray-300'
                      }`}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </div>
              <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-[#3b3b3b] p-4">
                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#252525] w-full rounded-md"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-auto bg-gray-50 dark:bg-[#202020]">
          <main className="py-6 px-4 sm:px-6 md:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}