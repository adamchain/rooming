import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Home, Building2, Calculator, CreditCard, Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';

const navigationItems = [
  { id: 'dashboard', icon: Home, label: 'Dashboard', path: '/' },
  { id: 'assets', icon: Building2, label: 'Asset Manager', path: '/assets' },
  { id: 'quickbooks', icon: Calculator, label: 'QuickBooks', path: '/quickbooks' },
  { id: 'payments', icon: CreditCard, label: 'Payments', path: '/payments' }
];

export function Layout() {
  const [darkMode, setDarkMode] = useState(false);

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