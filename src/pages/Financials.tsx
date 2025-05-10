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
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
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
            <div className="max-w-lg mx-auto mt-10 bg-white dark:bg-[#252525] p-8 rounded border border-gray-200 dark:border-[#3b3b3b] transition-colors duration-200">
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
            <MerchantOnboarding onComplete={() => {
              setHasMerchantAccount(true);
              setShowMerchantOnboarding(false);
            }} />
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
    </div>
  );
}