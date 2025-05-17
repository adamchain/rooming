import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, DollarSign, Calendar, ChevronDown, AlertCircle, Check } from 'lucide-react';
import { gettrxApi } from '../../services/gettrx';

const mockCustomers = [
  { id: '1', name: 'John Smith', email: 'john.smith@example.com' },
  { id: '2', name: 'Sarah Johnson', email: 'sarah.j@example.com' },
  { id: '3', name: 'Michael Brown', email: 'mbrown@example.com' },
  { id: '4', name: 'Emily Davis', email: 'emily.davis@example.com' },
  { id: '5', name: 'David Wilson', email: 'dwilson@example.com' }
];

const LandlordPayments: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [customers, setCustomers] = useState<any[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  
  const navigate = useNavigate();
  
  // Check if user is logged in
  useEffect(() => {
    const landlordEmail = localStorage.getItem('landlord_email');
    
    if (!landlordEmail) {
      navigate('/landlord/login');
      return;
    }
    
    // Load customers (using mock data for demo)
    setCustomers(mockCustomers);
  }, [navigate]);
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and decimals
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setAmount(value);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCustomer) {
      setPaymentError('Please select a tenant');
      return;
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      setPaymentError('Please enter a valid amount');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate payment processing (this would be an API call in a real app)
    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
      setPaymentSuccess(true);
    }, 2000);
  };
  
  const resetForm = () => {
    setStep(1);
    setSelectedCustomer(null);
    setAmount('');
    setDescription('');
    setPaymentDate('');
    setPaymentSuccess(false);
    setPaymentError('');
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <CreditCard className="h-6 w-6 text-blue-600 mr-2" />
          <h1 className="text-2xl font-bold text-gray-900">Process Payment</h1>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 max-w-2xl mx-auto">
          {step === 1 && (
            <>
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Enter Payment Details</h2>
              
              {paymentError && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-red-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{paymentError}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  {/* Tenant Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Tenant
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        className="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      >
                        <span className="block truncate">
                          {selectedCustomer ? selectedCustomer.name : 'Select a tenant'}
                        </span>
                        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        </span>
                      </button>
                      
                      {isDropdownOpen && (
                        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto max-h-60 focus:outline-none sm:text-sm">
                          {customers.map((customer) => (
                            <div
                              key={customer.id}
                              className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-blue-50"
                              onClick={() => {
                                setSelectedCustomer(customer);
                                setIsDropdownOpen(false);
                              }}
                            >
                              <div className="flex items-center">
                                <span className="font-normal block truncate">
                                  {customer.name}
                                </span>
                              </div>
                              
                              {selectedCustomer && selectedCustomer.id === customer.id ? (
                                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600">
                                  <Check className="h-5 w-5" />
                                </span>
                              ) : null}
                            </div>
                          ))}
                        </div>
                      )}
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
                  
                  {/* Description */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description (Optional)
                    </label>
                    <input
                      type="text"
                      id="description"
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="e.g., April 2023 Rent"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  
                  {/* Payment Date */}
                  <div>
                    <label htmlFor="payment-date" className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Date
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        id="payment-date"
                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                        value={paymentDate}
                        onChange={(e) => setPaymentDate(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                        isLoading ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        'Process Payment'
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </>
          )}
          
          {step === 2 && paymentSuccess && (
            <div className="text-center py-6">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Payment Successful!</h3>
              <div className="mt-6 bg-gray-50 p-4 rounded-md">
                <div className="space-y-2 text-left">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Tenant:</span>
                    <span className="text-sm font-medium text-gray-900">{selectedCustomer?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Amount:</span>
                    <span className="text-sm font-medium text-gray-900">${parseFloat(amount).toFixed(2)}</span>
                  </div>
                  {description && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Description:</span>
                      <span className="text-sm font-medium text-gray-900">{description}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Date:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {paymentDate || new Date().toISOString().split('T')[0]}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Transaction ID:</span>
                    <span className="text-sm font-medium text-gray-900">
                      TRX-{Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-6 space-x-3">
                <button
                  onClick={resetForm}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Process Another Payment
                </button>
                <button
                  onClick={() => navigate('/landlord/dashboard')}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LandlordPayments;