import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, ArrowUpRight, AlertTriangle, CreditCard } from 'lucide-react';
import financialService from '../services/financialService';
import merchantService from '../services/merchantService';
import RentPaymentForm from '../components/RentPaymentForm';
import { formatCurrency } from '../utils/formatters';

export default function Financials() {
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showMerchantOnboarding, setShowMerchantOnboarding] = useState(false);
  const [hasMerchantAccount, setHasMerchantAccount] = useState(false);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const isConnected = await financialService.isConnected();
      setConnected(isConnected);
      if (isConnected) {
        loadMetrics();
      }

      // Check merchant account status
      const merchantAccount = await merchantService.getMerchantAccount();
      setHasMerchantAccount(!!merchantAccount);
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

  const handlePaymentSuccess = () => {
    alert('Payment processed successfully!');
    loadMetrics();
  };

  const handlePaymentError = (error: string) => {
    setError(error);
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
        <div className="flex space-x-3">
          {!hasMerchantAccount && (
            <button
              onClick={() => setShowMerchantOnboarding(true)}
              className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-500 text-white font-medium rounded transition-colors"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Set Up Payments
            </button>
          )}
          {!connected && (
            <button
              onClick={handleConnect}
              className="inline-flex items-center px-4 py-2 bg-[#0078d4] hover:bg-[#106ebe] text-white font-medium rounded transition-colors"
            >
              Connect QuickBooks
            </button>
          )}
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

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-[#3b3b3b]">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`${
              activeTab === 'overview'
                ? 'border-[#0078d4] text-[#0078d4]'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('rent')}
            className={`${
              activeTab === 'rent'
                ? 'border-[#0078d4] text-[#0078d4]'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Rent
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && metrics && (
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
      )}

      {activeTab === 'rent' && (
        <div className="flex justify-center">
          <RentPaymentForm
            amount={1500}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
            setupRecurring
          />
        </div>
      )}
    </div>
  );
}