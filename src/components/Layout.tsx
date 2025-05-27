import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Home, Building2, Calculator, CreditCard, Moon, Sun, Users, Wrench, FileText, DollarSign, Phone, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const navigationItems = [
  { id: 'dashboard', icon: Home, label: 'Dashboard', path: '/dashboard' },
  { id: 'properties', icon: Building2, label: 'Properties', path: '/properties' },
  { id: 'tenants', icon: Users, label: 'Tenants', path: '/tenants' },
  { id: 'maintenance', icon: Wrench, label: 'Maintenance', path: '/maintenance' },
  { id: 'payments', icon: DollarSign, label: 'Payments', path: '/payments' },
  { id: 'financials', icon: Calculator, label: 'Financials', path: '/financials' },
  { id: 'documents', icon: FileText, label: 'Documents', path: '/documents' },
  { id: 'contacts', icon: Phone, label: 'Contacts', path: '/contacts' },
  { id: 'assets', icon: Building2, label: 'Asset Manager', path: '/assets' },
  { id: 'quickbooks', icon: Calculator, label: 'QuickBooks', path: '/quickbooks' },
  { id: 'gettrx', icon: CreditCard, label: 'Payment Processing', path: '/payments' }
];

export function Layout() {
  const { signOut, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
    
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isAuthenticated, navigate]);

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
    await signOut();
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-[#202020]">
      {/* Sidebar */}
      <nav className="w-64 bg-white dark:bg-[#1b1b1b] shadow-lg">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Rooming</h1>
        </div>
        <ul className="space-y-2 p-4">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#252525]'
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            );
          })}
          
          <li className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#252525] w-full text-left"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white dark:bg-[#1b1b1b] shadow-sm p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Property Management System</h2>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-[#252525]"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-gray-700" />}
          </button>
        </header>
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}