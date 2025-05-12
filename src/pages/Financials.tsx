import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, ArrowUpRight, AlertTriangle } from 'lucide-react';
import financialService from '../services/financialService';
import merchantService from '../services/merchantService';
import { formatCurrency } from '../utils/formatters';
import MerchantOnboarding from '../components/MerchantOnboarding';

export default function Financials() {
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [hasMerchantAccount, setHasMerchantAccount] = useState(false);
  const [showMerchantOnboarding, setShowMerchantOnboarding] = useState(false);
  const [showMerchantSignIn, setShowMerchantSignIn] = useState(false);
  const [merchantCredentials, setMerchantCredentials] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
    checkConnections();
  }, []);

  const checkConnections = async () => {
    try {
      const [quickbooksConnected, merchantAccount] = await Promise.all([
        financialService.isConnected(),
        merchantService.getMerchantAccount()
      ]);

      setConnected(quickbooksConnected);
      setHasMerchantAccount(!!merchantAccount);

      if (quickbooksConnected) {
        loadMetrics();
      }
    } catch (err) {
      console.error('Error checking connections:', err);
      setError('Failed to check connections');
    } finally {
      setLoading(false);
    }
  };

  const loadMetrics = async () => {
    try {
      const data = await financialService.getMetrics();
      setMetrics(data);
    } catch (err) {
      console.error('Error loading metrics:', err);
      setError('Failed to load financial metrics');
    }
  };

  const handleConnect = async () => {
    try {
      await financialService.connect();
    } catch (err) {
      console.error('Error connecting to QuickBooks:', err);
      setError('Failed to connect to QuickBooks');
    }
  };

  const handleMerchantSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await merchantService.signInMerchant(merchantCredentials.email, merchantCredentials.password);
      setHasMerchantAccount(true);
      setShowMerchantSignIn(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in to merchant account');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-t-[#0078d4] border-r-[#0078d4] border-b-transparent border-l-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Financial Overview</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'overview'
                ? 'bg-[#0078d4] text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('rent')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'rent'
                ? 'bg-[#0078d4] text-white'
                : 'bg-white dark:bg-[#1b1b1b] text-[#0078d4] border border-[#0078d4] hover:bg-[#0078d4] hover:text-white'
            }`}
          >
            Rent
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-300">{error}</h3>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'overview' && (
        <>
          {!connected ? (
            <div className="max-w-lg mx-auto mt-10 bg-white dark:bg-[#252525] p-8 rounded-lg shadow">
              <div className="text-center">
                <DollarSign className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                <h2 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
                  Connect to QuickBooks
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Connect your QuickBooks account to sync your financial data
                </p>
              </div>
              <div className="mt-6">
                <button
                  onClick={handleConnect}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded shadow-sm text-sm font-medium text-white bg-[#0078d4] hover:bg-[#106ebe] transition-colors"
                >
                  Connect QuickBooks
                </button>
              </div>
            </div>
          ) : (
            metrics && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {/* Revenue */}
                <div className="bg-white dark:bg-[#252525] overflow-hidden rounded border border-gray-200 dark:border-[#3b3b3b] transition-colors duration-200">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-500">
                          <DollarSign className="h-5 w-5" />
                        </div>
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                          Revenue
                        </div>
                        <div className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                            {formatCurrency(metrics.revenue)}
                          </div>
                          <div className="ml-2 flex items-center text-xs font-medium text-green-500">
                            <ArrowUpRight className="h-3 w-3 mr-0.5" />
                            8.1%
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expenses */}
                <div className="bg-white dark:bg-[#252525] overflow-hidden rounded border border-gray-200 dark:border-[#3b3b3b] transition-colors duration-200">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/30 text-red-500">
                          <DollarSign className="h-5 w-5" />
                        </div>
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                          Expenses
                        </div>
                        <div className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                            {formatCurrency(metrics.expenses)}
                          </div>
                          <div className="ml-2 flex items-center text-xs font-medium text-red-500">
                            <ArrowUpRight className="h-3 w-3 mr-0.5" />
                            3.2%
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Net Profit */}
                <div className="bg-white dark:bg-[#252525] overflow-hidden rounded border border-gray-200 dark:border-[#3b3b3b] transition-colors duration-200">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="p-2 rounded-full bg-[#0078d4]/10 text-[#0078d4]">
                          <TrendingUp className="h-5 w-5" />
                        </div>
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                          Net Profit
                        </div>
                        <div className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                            {formatCurrency(metrics.profit)}
                          </div>
                          <div className="ml-2 flex items-center text-xs font-medium text-green-500">
                            <ArrowUpRight className="h-3 w-3 mr-0.5" />
                            12.5%
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cash Flow */}
                <div className="bg-white dark:bg-[#252525] overflow-hidden rounded border border-gray-200 dark:border-[#3b3b3b] transition-colors duration-200">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-500">
                          <DollarSign className="h-5 w-5" />
                        </div>
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                          Cash Flow
                        </div>
                        <div className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                            {formatCurrency(metrics.cashFlow)}
                          </div>
                          <div className="ml-2 flex items-center text-xs font-medium text-green-500">
                            <ArrowUpRight className="h-3 w-3 mr-0.5" />
                            5.4%
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </>
      )}

      {activeTab === 'rent' && (
        <div className="flex justify-center">
          {!hasMerchantAccount ? (
            <div className="bg-white dark:bg-[#252525] p-6 rounded-lg shadow-lg max-w-md w-full">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Set Up Rent Payments</h2>
              <div className="space-y-4">
                <button
                  onClick={() => setShowMerchantOnboarding(true)}
                  className="w-full py-3 px-4 bg-[#0078d4] text-white rounded-lg hover:bg-[#106ebe] transition-colors"
                >
                  Create New Merchant Account
                </button>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white dark:bg-[#252525] text-gray-500 dark:text-gray-400">or</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowMerchantSignIn(true)}
                  className="w-full py-3 px-4 border border-[#0078d4] text-[#0078d4] rounded-lg hover:bg-[#0078d4] hover:text-white transition-colors"
                >
                  Sign In to Existing Account
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Merchant Account Active</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Your merchant account is set up and ready to receive rent payments.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Merchant Sign In Modal */}
      {showMerchantSignIn && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#252525] rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Sign In to GETTRX</h2>
            <form onSubmit={handleMerchantSignIn} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  value={merchantCredentials.email}
                  onChange={(e) => setMerchantCredentials({ ...merchantCredentials, email: e.target.value })}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <input
                  type="password"
                  value={merchantCredentials.password}
                  onChange={(e) => setMerchantCredentials({ ...merchantCredentials, password: e.target.value })}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowMerchantSignIn(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-[#0078d4] rounded-md hover:bg-[#106ebe]"
                >
                  Sign In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Merchant Onboarding Modal */}
      {showMerchantOnboarding && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#252525] rounded-lg p-6 max-w-2xl w-full">
            <MerchantOnboarding onComplete={() => {
              setHasMerchantAccount(true);
              setShowMerchantOnboarding(false);
            }} />
          </div>
        </div>
      )}
    </div>
  );
}