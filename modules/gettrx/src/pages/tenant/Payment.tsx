import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Building, DollarSign, Check, AlertCircle, Info } from 'lucide-react';
import { initializeGetTrxElements, createPaymentToken, gettrxApi } from '../../services/gettrx';

const mockLandlords = [
  { id: '1', name: 'Waelchi - Sanford', accountId: 'acm_67c1039bd94d3f0001ee9801' },
  { id: '2', name: 'Stiedemann and Stroman DBA', accountId: 'acm_67c103e6d94d3f0001ee9805' },
];

enum PaymentStatus {
  IDLE = 'idle',
  PROCESSING = 'processing',
  SUCCESS = 'success',
  ERROR = 'error'
}

const TenantPayment: React.FC = () => {
  const [amount, setAmount] = useState('');
  const [saveCard, setSaveCard] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(PaymentStatus.IDLE);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedLandlord, setSelectedLandlord] = useState(mockLandlords[0]);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const paymentElementRef = useRef<HTMLDivElement>(null);
  const [paymentElementInitialized, setPaymentElementInitialized] = useState(false);
  const [gettrxInstance, setGettrxInstance] = useState<any>(null);

  useEffect(() => {
    // Only initialize when we have an amount
    if (!amount) return;

    const initializePayment = async () => {
      if (!paymentElementRef.current) return;

      try {
        setErrorMessage('');
        console.log('Initializing payment element with amount:', amount);

        // Check if public key is available
        //const publicKey = gettrxApi.getPublicKey();
        const publicKey = 'pk_rW2wp1rnulRnx7oJQN8V_L-qEplUMSdm-eBQ1R24BkmW51f7ETcmpN0aUAN66dOm';
        if (!publicKey) {
          throw new Error('GetTRX public key is not available');
        }

        // Initialize GetTRX with options
        const options = {
          mode: 'payment',
          currency: 'usd',
          amount: parseFloat(amount).toFixed(2), // Format as string with 2 decimal places
          paymentMethodTypes: ['card', 'us_bank_account'],
          setupFutureUsage: saveCard ? 'off_session' : undefined,
          onBehalfOf: selectedLandlord.accountId // Use the landlord's account ID
        };

        const instance = await initializeGetTrxElements('#payment-element', options);
        setGettrxInstance(instance);
        setPaymentElementInitialized(true);

      } catch (error) {
        console.error('Failed to initialize payment form:', error);
        setErrorMessage('Failed to initialize payment form. Please refresh and try again.');
        setPaymentElementInitialized(false);
      }
    };

    setPaymentElementInitialized(false);
    initializePayment();

  }, [amount, saveCard, selectedLandlord]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setAmount(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || parseFloat(amount) <= 0) {
      setErrorMessage('Please enter a valid amount');
      return;
    }

    if (!fullName) {
      setErrorMessage('Please enter your full name');
      return;
    }

    if (!email) {
      setErrorMessage('Please enter your email address');
      return;
    }

    if (!paymentElementInitialized) {
      setErrorMessage('Payment form is not ready yet. Please wait a moment.');
      return;
    }

    setPaymentStatus(PaymentStatus.PROCESSING);
    setErrorMessage('');

    try {
      // Create a payment token
      const paymentToken = await createPaymentToken();
      console.log('Payment token created:', paymentToken);

      // Here you would send the token to your server to process the payment
      // For this demo, we'll simulate a successful payment

      setTimeout(() => {
        setPaymentStatus(PaymentStatus.SUCCESS);
      }, 1500);

    } catch (error) {
      console.error('Payment processing error:', error);
      setErrorMessage('Payment failed. Please check your payment details and try again.');
      setPaymentStatus(PaymentStatus.ERROR);
    }
  };

  const resetForm = () => {
    setAmount('');
    setSaveCard(false);
    setPaymentStatus(PaymentStatus.IDLE);
    setErrorMessage('');
    setFullName('');
    setEmail('');
    setPaymentElementInitialized(false);
    setGettrxInstance(null);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Make a Payment</h1>
            <p className="mt-2 text-gray-600">
              Pay your rent quickly and securely
            </p>
          </div>

          {paymentStatus === PaymentStatus.SUCCESS ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="mt-4 text-xl font-semibold text-gray-900">Payment Successful!</h2>
              <p className="mt-2 text-gray-600">
                Your payment of ${parseFloat(amount).toFixed(2)} has been processed successfully.
              </p>

              <div className="mt-6 bg-gray-50 p-4 rounded-md">
                <div className="text-left space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Amount:</span>
                    <span className="font-medium">${parseFloat(amount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Landlord:</span>
                    <span className="font-medium">{selectedLandlord.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Date:</span>
                    <span className="font-medium">{new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Transaction ID:</span>
                    <span className="font-medium">
                      TRX-{Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex space-x-3 justify-center">
                <button
                  onClick={resetForm}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Make Another Payment
                </button>
                <Link
                  to="/tenant/history"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  View Payment History
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="bg-blue-600 px-6 py-4">
                <h2 className="text-xl font-semibold text-white">Payment Details</h2>
              </div>

              <form onSubmit={handleSubmit} className="px-6 py-6">
                {errorMessage && (
                  <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertCircle className="h-5 w-5 text-red-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{errorMessage}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-6">
                  {/* Landlord Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Your Landlord
                    </label>
                    <div className="relative">
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Building className="h-5 w-5 text-gray-400" />
                        </div>
                        <select
                          className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md"
                          value={selectedLandlord.id}
                          onChange={(e) => {
                            const landlord = mockLandlords.find(l => l.id === e.target.value);
                            if (landlord) setSelectedLandlord(landlord);
                          }}
                        >
                          {mockLandlords.map(landlord => (
                            <option key={landlord.id} value={landlord.id}>
                              {landlord.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Personal Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="full-name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="full-name"
                        className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Amount */}
                  <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Amount ($)
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="amount"
                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md"
                        placeholder="0.00"
                        value={amount}
                        onChange={handleAmountChange}
                        required
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">USD</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Element */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Information
                    </label>
                    <div className="min-h-44 p-4 border border-gray-300 rounded-md">
                      <div id="payment-element" ref={paymentElementRef} className="min-h-28">
                        {!amount ? (
                          <div className="p-4 bg-gray-50 rounded-md text-center">
                            <CreditCard className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">
                              Please enter an amount above to load the payment form
                            </p>
                          </div>
                        ) : !paymentElementInitialized ? (
                          <div className="p-4 bg-gray-50 rounded-md text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto mb-2"></div>
                            <p className="text-sm text-gray-500">
                              Loading payment form...
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                              For testing, use card number: 4242 4242 4242 4242
                            </p>
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="mt-2 flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="save-card"
                          name="save-card"
                          type="checkbox"
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                          checked={saveCard}
                          onChange={(e) => setSaveCard(e.target.checked)}
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="save-card" className="font-medium text-gray-700">
                          Save payment method for future payments
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Security Note */}
                  <div className="bg-blue-50 p-4 rounded-md">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Info className="h-5 w-5 text-blue-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-blue-700">
                          Your payment information is securely processed by GetTRX. We never store your complete card details.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={paymentStatus === PaymentStatus.PROCESSING || !paymentElementInitialized}
                      className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${(paymentStatus === PaymentStatus.PROCESSING || !paymentElementInitialized) ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                    >
                      {paymentStatus === PaymentStatus.PROCESSING ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                          Processing Payment...
                        </>
                      ) : !paymentElementInitialized ? (
                        'Preparing Payment Form...'
                      ) : (
                        'Pay Now'
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TenantPayment;