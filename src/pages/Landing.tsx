import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Key, Moon, Sun, ChevronRight } from 'lucide-react';
import Auth from '../components/Auth';

export default function MinimalistLanding() {
  const navigate = useNavigate();
  const [showAuth, setShowAuth] = useState(false);
  const [authRole, setAuthRole] = useState('tenant');
  const [darkMode, setDarkMode] = useState(false);

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

  const handleAuthClick = (role) => {
    setAuthRole(role);
    setShowAuth(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#202020] text-gray-900 dark:text-gray-200 transition-colors duration-200">
      {/* Header */}
      <header className="bg-gray-100 dark:bg-[#1b1b1b] border-b border-gray-200 dark:border-[#3b3b3b] py-3 px-4 md:px-6 transition-colors duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img src="/logo-nobg.png" alt="Rooming" className="h-8 w-8 invert" />
            <span className="ml-2 text-xl font-medium text-gray-900 dark:text-white">Rooming</span>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-full hover:bg-gray-200 dark:hover:bg-[#292929] transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button
              onClick={() => handleAuthClick('tenant')}
              className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-2 sm:px-3 py-1.5 text-sm font-medium border border-transparent hover:border-gray-300 dark:hover:border-[#3b3b3b] hover:bg-gray-200 dark:hover:bg-[#292929] rounded transition-colors"
            >
              Sign in
            </button>
          </div>
        </div>
      </header>

      {/* Main Content - Responsive Layout */}
      <main className="flex-1 flex flex-col md:flex-row">
        {/* Left Section: Content - Full width on mobile, half on desktop */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-10 flex flex-col justify-center">
          <div className="max-w-xl mx-auto md:mx-0">
            <div className="inline-block py-1 px-3 mb-4 sm:mb-6 bg-[#0078d4]/10 border border-[#0078d4]/20 rounded-sm text-[#0078d4]">
              <span className="text-sm font-medium">Property Management</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-gray-900 dark:text-white mb-4 sm:mb-6">
              Manage your properties with ease
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8">
              A modern solution for landlords and tenants to streamline property management operations.
            </p>

            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => handleAuthClick('tenant')}
                className="inline-flex items-center justify-center px-6 py-2.5 text-base font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-[#2b2b2b] hover:bg-gray-100 dark:hover:bg-[#3b3b3b] border border-gray-300 dark:border-[#3b3b3b] rounded transition-colors"
              >
                <Key className="h-5 w-5 mr-2" />
                Tenant Portal
              </button>
              <button
                onClick={() => handleAuthClick('landlord')}
                className="inline-flex items-center justify-center px-6 py-2.5 text-base font-medium text-white bg-[#0078d4] hover:bg-[#106ebe] rounded transition-colors"
              >
                <Building2 className="h-5 w-5 mr-2" />
                Property Owner
              </button>
            </div>
          </div>
        </div>

        {/* Right Section: Hero Image - Hidden on smallest screens, visible from medium up */}
        <div className="hidden md:flex w-full md:w-1/2 bg-gradient-to-br from-[#0078d4]/5 via-[#0078d4]/10 to-[#0078d4]/5 dark:from-[#0078d4]/20 dark:via-[#0078d4]/10 dark:to-[#0078d4]/5 items-center justify-center p-6 md:p-10">
          <div className="relative w-full max-w-md aspect-video bg-white dark:bg-[#252525] rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-[#3b3b3b]">
            {/* Dashboard Preview Image */}
            <div className="absolute top-0 left-0 right-0 h-10 bg-gray-100 dark:bg-[#1b1b1b] border-b border-gray-200 dark:border-[#3b3b3b] flex items-center px-4">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <div className="flex-1 text-center text-xs text-gray-500 dark:text-gray-400">Property Dashboard</div>
            </div>

            <div className="pt-10 px-6 pb-6 h-full flex flex-col">
              {/* Dashboard Content Preview */}
              <div className="flex space-x-4 mb-4">
                <div className="w-1/2 h-20 bg-gray-100 dark:bg-[#2b2b2b] rounded"></div>
                <div className="w-1/2 h-20 bg-gray-100 dark:bg-[#2b2b2b] rounded"></div>
              </div>
              <div className="h-24 bg-gray-100 dark:bg-[#2b2b2b] rounded mb-4"></div>
              <div className="flex flex-1 space-x-4">
                <div className="w-1/3 bg-gray-100 dark:bg-[#2b2b2b] rounded"></div>
                <div className="w-2/3 bg-gray-100 dark:bg-[#2b2b2b] rounded"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile-only feature highlights - Visible on small screens only */}
        <div className="block md:hidden px-6 py-8 bg-gray-50 dark:bg-[#1b1b1b] border-t border-gray-200 dark:border-[#3b3b3b]">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
            Key Features
          </h2>
          <div className="space-y-4">
            <div className="flex items-start p-4 bg-white dark:bg-[#252525] rounded-lg border border-gray-200 dark:border-[#3b3b3b]">
              <div className="p-2 bg-[#0078d4]/10 rounded-full mr-4">
                <Building2 className="h-5 w-5 text-[#0078d4]" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-1">Property Management</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Easily manage multiple properties from a single dashboard</p>
              </div>
            </div>

            <div className="flex items-start p-4 bg-white dark:bg-[#252525] rounded-lg border border-gray-200 dark:border-[#3b3b3b]">
              <div className="p-2 bg-[#0078d4]/10 rounded-full mr-4">
                <Key className="h-5 w-5 text-[#0078d4]" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-1">Tenant Portal</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Streamlined communication and payments for tenants</p>
              </div>
            </div>

            <a href="#learn-more" className="flex items-center justify-center text-[#0078d4] text-sm font-medium mt-2">
              Learn more about features <ChevronRight size={16} className="ml-1" />
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-[#1b1b1b] border-t border-gray-200 dark:border-[#3b3b3b] py-3 px-4 md:px-6 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="mb-2 sm:mb-0">© 2025 Rooming, Inc. All rights reserved.</div>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-gray-700 dark:hover:text-gray-300">Privacy</a>
            <a href="#" className="hover:text-gray-700 dark:hover:text-gray-300">Terms</a>
            <a href="#" className="hover:text-gray-700 dark:hover:text-gray-300">Contact</a>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      {showAuth && (
        <Auth
          defaultRole={authRole}
          onAuthSuccess={() => {
            setShowAuth(false);
            navigate(authRole === 'tenant' ? '/tenant/dashboard' : '/dashboard');
          }}
          onClose={() => setShowAuth(false)}
        />
      )}
    </div>
  );
}