import React, { useState } from 'react';
import { AlertCircle, X } from 'lucide-react';
import merchantService from '../services/merchantService';

interface MerchantOnboardingProps {
  onComplete: () => void;
  onClose?: () => void;
}

export default function MerchantOnboarding({ onComplete, onClose }: MerchantOnboardingProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    businessName: '',
    email: '',
    phone: '',
    address: {
      line1: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'US'
    },
    bankAccount: {
      accountNumber: '',
      routingNumber: '',
      accountType: 'checking' as const
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await merchantService.createMerchantAccount(formData);
      onComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create merchant account');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Business Name
              </label>
              <input
                type="text"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                required
                className="w-full bg-white dark:bg-[#1b1b1b] border border-gray-300 dark:border-[#3b3b3b] rounded p-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0078d4] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full bg-white dark:bg-[#1b1b1b] border border-gray-300 dark:border-[#3b3b3b] rounded p-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0078d4] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="w-full bg-white dark:bg-[#1b1b1b] border border-gray-300 dark:border-[#3b3b3b] rounded p-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0078d4] focus:border-transparent"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Street Address
              </label>
              <input
                type="text"
                value={formData.address.line1}
                onChange={(e) => setFormData({
                  ...formData,
                  address: { ...formData.address, line1: e.target.value }
                })}
                required
                className="w-full bg-white dark:bg-[#1b1b1b] border border-gray-300 dark:border-[#3b3b3b] rounded p-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0078d4] focus:border-transparent"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={formData.address.city}
                  onChange={(e) => setFormData({
                    ...formData,
                    address: { ...formData.address, city: e.target.value }
                  })}
                  required
                  className="w-full bg-white dark:bg-[#1b1b1b] border border-gray-300 dark:border-[#3b3b3b] rounded p-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0078d4] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  State
                </label>
                <input
                  type="text"
                  value={formData.address.state}
                  onChange={(e) => setFormData({
                    ...formData,
                    address: { ...formData.address, state: e.target.value }
                  })}
                  required
                  className="w-full bg-white dark:bg-[#1b1b1b] border border-gray-300 dark:border-[#3b3b3b] rounded p-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0078d4] focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Postal Code
              </label>
              <input
                type="text"
                value={formData.address.postalCode}
                onChange={(e) => setFormData({
                  ...formData,
                  address: { ...formData.address, postalCode: e.target.value }
                })}
                required
                className="w-full bg-white dark:bg-[#1b1b1b] border border-gray-300 dark:border-[#3b3b3b] rounded p-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0078d4] focus:border-transparent"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Bank Account Number
              </label>
              <input
                type="text"
                value={formData.bankAccount.accountNumber}
                onChange={(e) => setFormData({
                  ...formData,
                  bankAccount: { ...formData.bankAccount, accountNumber: e.target.value }
                })}
                required
                className="w-full bg-white dark:bg-[#1b1b1b] border border-gray-300 dark:border-[#3b3b3b] rounded p-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0078d4] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Routing Number
              </label>
              <input
                type="text"
                value={formData.bankAccount.routingNumber}
                onChange={(e) => setFormData({
                  ...formData,
                  bankAccount: { ...formData.bankAccount, routingNumber: e.target.value }
                })}
                required
                className="w-full bg-white dark:bg-[#1b1b1b] border border-gray-300 dark:border-[#3b3b3b] rounded p-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0078d4] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Account Type
              </label>
              <select
                value={formData.bankAccount.accountType}
                onChange={(e) => setFormData({
                  ...formData,
                  bankAccount: {
                    ...formData.bankAccount,
                    accountType: e.target.value as 'checking' | 'savings'
                  }
                })}
                className="w-full bg-white dark:bg-[#1b1b1b] border border-gray-300 dark:border-[#3b3b3b] rounded p-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0078d4] focus:border-transparent"
              >
                <option value="checking">Checking</option>
                <option value="savings">Savings</option>
              </select>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-[#252525] p-6 rounded-lg max-w-md w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Set Up Merchant Account</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

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

      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-200 dark:border-[#3b3b3b]"></div>
              </div>
              <div className="relative flex justify-between">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium ${
                      s === step
                        ? 'bg-[#0078d4] text-white'
                        : s < step
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 dark:bg-[#3b3b3b] text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {s}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {renderStep()}

        <div className="mt-6 flex justify-between">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#1b1b1b] border border-gray-300 dark:border-[#3b3b3b] rounded hover:bg-gray-50 dark:hover:bg-[#292929] transition-colors"
            >
              Back
            </button>
          )}
          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className={`px-4 py-2 text-sm font-medium text-white bg-[#0078d4] hover:bg-[#106ebe] rounded transition-colors ${
                step > 1 ? 'ml-auto' : ''
              }`}
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className={`ml-auto px-4 py-2 text-sm font-medium text-white rounded transition-colors ${
                loading
                  ? 'bg-[#0078d4]/50 cursor-not-allowed'
                  : 'bg-[#0078d4] hover:bg-[#106ebe]'
              }`}
            >
              {loading ? 'Setting up...' : 'Complete Setup'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}