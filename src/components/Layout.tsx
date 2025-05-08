import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  Building2,
  Wrench,
  Users,
  Phone,
  DollarSign,
  FileText,
  Bell,
  LogOut,
  Moon,
  Sun,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Initialize dark mode on component mount
  useEffect(() => {
    // Check if dark mode preference exists in localStorage
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);

    // Add or remove dark class based on preference
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);

    // Save preference to localStorage
    localStorage.setItem('darkMode', newDarkMode.toString());

    // Add or remove dark class
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const navigation = [
    { name: 'Dashboard', icon: Home, href: '/dashboard' },
    { name: 'Properties', icon: Building2, href: '/dashboard/properties' },
    { name: 'Maintenance', icon: Wrench, href: '/dashboard/maintenance' },
    { name: 'Tenants', icon: Users, href: '/dashboard/tenants' },
    { name: 'Contacts', icon: Phone, href: '/dashboard/contacts' },
    { name: 'Financials', icon: DollarSign, href: '/dashboard/financials' },
    { name: 'Documents', icon: FileText, href: '/dashboard/documents' },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#202020] text-gray-900 dark:text-gray-200 transition-colors duration-200">
      {/* Top navigation */}
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
              <Link to="/dashboard" className="flex items-center">
                <img src="/logo-nobg.png" alt="Rooming" className="h-8 w-8 invert" />
                <span className="text-xl font-medium text-gray-900 dark:text-white">Rooming</span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              {/* Dark mode toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-full hover:bg-gray-200 dark:hover:bg-[#292929] transition-colors"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {/* Notifications */}
              <button className="p-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-full hover:bg-gray-200 dark:hover:bg-[#292929] transition-colors relative">
                <Bell size={20} />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
              </button>

              {/* User menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center text-sm rounded-full focus:outline-none"
                >
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-[#0078d4] flex items-center justify-center text-white font-medium">
                      {user?.email ? user.email.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="ml-2 hidden md:flex flex-col items-start">
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{user?.email}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">Property Manager</span>
                    </div>
                    <ChevronDown className="ml-1 h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </div>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#252525] rounded-md shadow-lg py-1 border border-gray-200 dark:border-[#3b3b3b] z-50">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2d2d2d]">
                      Your Profile
                    </Link>
                    <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2d2d2d]">
                      Settings
                    </Link>
                    <div className="border-t border-gray-200 dark:border-[#3b3b3b]"></div>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2d2d2d]"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
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
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive(item.href)
                      ? 'bg-[#0078d4]/10 text-[#0078d4]'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#292929]'
                      }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                ))}

                {/* Document Hub with special styling */}
                <Link
                  to="/dashboard/document-hub"
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md mt-4 bg-gradient-to-r from-[#0078d4] to-[#106ebe] text-white hover:from-[#106ebe] hover:to-[#0553b1] transition-colors"
                >
                  <FileText className="mr-3 h-5 w-5" />
                  Document Hub
                </Link>
              </div>

              <div className="p-3 border-t border-gray-200 dark:border-[#3b3b3b]">
                <button
                  onClick={handleSignOut}
                  className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#292929] rounded-md"
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sidebar - desktop permanent */}
        <div className="hidden md:flex flex-col w-64 border-r border-gray-200 dark:border-[#3b3b3b] bg-white dark:bg-[#1b1b1b] transition-colors duration-200">
          <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive(item.href)
                  ? 'bg-[#0078d4]/10 text-[#0078d4]'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#292929]'
                  }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}

            {/* Document Hub with special styling */}
            <Link
              to="/dashboard/document-hub"
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md mt-4 bg-gradient-to-r from-[#0078d4] to-[#106ebe] text-white hover:from-[#106ebe] hover:to-[#0553b1] transition-colors"
            >
              <FileText className="mr-3 h-5 w-5" />
              Document Hub
            </Link>
          </div>

          <div className="p-3 border-t border-gray-200 dark:border-[#3b3b3b]">
            <button
              onClick={handleSignOut}
              className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#292929] rounded-md"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 overflow-y-auto">
          <main className="p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}