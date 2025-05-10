import React, { useState, useEffect } from 'react';
import { AlertCircle, CreditCard } from 'lucide-react';
import paymentService from '../services/paymentService';
import { formatCurrency } from '../utils/formatters';

interface RentPaymentFormProps {
  amount: number;
  onSuccess: () => void;
  onError: (error: string) => void;
  setupRecurring?: boolean;
}

declare global {
  interface Window {
    TRX: any;
  }
}

const RentPaymentForm = ({ amount, onSuccess, onError, setupRecurring = false }: RentPaymentFormProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cardElement, setCardElement] = useState<any>(null);
  const [trxInitialized, setTrxInitialized] = useState(false);

  useEffect(() => {
    // Load GETTRX SDK
    const script = document.createElement('script');
    script.src = 'https://js.gettrx.com/v1';
    script.async = true;
    script.onload = () => {
      try {
        // Initialize GETTRX after script loads
        const trx = window.TRX('pk_rW2wp1rnulRnx7oJQN8V_L-qEplUMSdm-eBQ1R24BkmW51f7ETcmpN0aUAN66dOm');
        
        // Create card element
        const element = trx.createElement('card', {
          style: {
            base: {
              fontSize: '16px',
              color: '#32325d',
              '::placeholder': {
                color: '#aab7c4'
              }
            },
            invalid: {
              color: '#fa755a',
              iconColor: '#fa755a'
            }
          }
        });

        // Mount card element
        element.mount('#card-element');
        setCardElement(element);
        setTrxInitialized(true);
      } catch (err) {
        console.error('Error initializing GETTRX:', err);
        setError('Failed to initialize payment system');
      }
    };

    script.onerror = () => {
      setError('Failed to load payment system');
      setLoading(false);
    };

    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardElement || !trxInitialized) {
      setError('Payment system not initialized');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      // Create payment token
      const { token } = await cardElement.tokenize({
        amount: amount * 100, // Convert to cents
        currency: 'usd',
        paymentMethodTypes: ['card'],
        setupFutureUsage: setupRecurring ? 'off_session' : undefined,
        onBehalfOf: 'acm_67c1039bd94d3f0001ee9801'
      });

      // Create customer for recurring payments
      if (setupRecurring) {
        const customer = await paymentService.createCustomer('Test Customer');
        console.log('Customer created:', customer);
      }

      // Process the payment
      const payment = await paymentService.createPayment(amount, token, setupRecurring);
      console.log('Payment processed:', payment);

      onSuccess();
    } catch (err) {
      console.error('Payment error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Payment failed';
      onError(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Pay Rent</h2>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 dark:bg-red-900/20 p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-300">{error}</h3>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Amount
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 dark:text-gray-400 sm:text-sm">$</span>
            </div>
            <input
              type="text"
              value={amount.toFixed(2)}
              disabled
              className="bg-gray-50 dark:bg-gray-700 focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Card Information
          </label>
          <div id="card-element" className="mt-1 p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700" />
        </div>

        {setupRecurring && (
          <div className="flex items-center">
            <input
              type="checkbox"
              id="setupRecurring"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="setupRecurring" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Save payment method for future rent payments
            </label>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !trxInitialized}
          className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            loading || !trxInitialized
              ? 'bg-indigo-400 dark:bg-indigo-500 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600'
          } transition-colors`}
        >
          <CreditCard className="h-4 w-4 mr-2" />
          {loading ? 'Processing...' : !trxInitialized ? 'Loading...' : `Pay ${formatCurrency(amount)}`}
        </button>
      </form>
    </div>
  );
};

export default RentPaymentForm;