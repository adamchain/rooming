import React, { useState } from 'react';
import { Plus, Trash2, AlertCircle } from 'lucide-react';
import { nanoid } from 'nanoid';
import { formatCurrency } from '../utils/formatters';

interface Contributor {
  id: string;
  name: string;
  email: string;
  amount: number;
}

interface SplitPaymentFormProps {
  totalAmount: number;
  onSubmit: (contributors: Contributor[]) => void;
  onCancel: () => void;
}

export default function SplitPaymentForm({ totalAmount, onSubmit, onCancel }: SplitPaymentFormProps) {
  const [contributors, setContributors] = useState<Contributor[]>([
    { id: nanoid(), name: '', email: '', amount: 0 }
  ]);
  const [error, setError] = useState<string | null>(null);

  const addContributor = () => {
    setContributors([...contributors, { id: nanoid(), name: '', email: '', amount: 0 }]);
  };

  const removeContributor = (id: string) => {
    if (contributors.length > 1) {
      setContributors(contributors.filter(c => c.id !== id));
    }
  };

  const updateContributor = (id: string, field: keyof Contributor, value: string | number) => {
    setContributors(contributors.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate total amount
    const total = contributors.reduce((sum, c) => sum + c.amount, 0);
    if (total !== totalAmount) {
      setError(`Total contributions must equal ${formatCurrency(totalAmount)}`);
      return;
    }

    // Validate all fields are filled
    if (contributors.some(c => !c.name || !c.email || !c.amount)) {
      setError('Please fill in all fields for each contributor');
      return;
    }

    onSubmit(contributors);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Split Payment</h2>
      <p className="text-gray-600 mb-6">
        Total Amount: {formatCurrency(totalAmount)}
      </p>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {contributors.map((contributor, index) => (
          <div key={contributor.id} className="p-4 border rounded-lg space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-gray-700">
                Contributor {index + 1}
              </h3>
              {contributors.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeContributor(contributor.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  value={contributor.name}
                  onChange={(e) => updateContributor(contributor.id, 'name', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={contributor.email}
                  onChange={(e) => updateContributor(contributor.id, 'email', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Amount
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={contributor.amount || ''}
                    onChange={(e) => updateContributor(contributor.id, 'amount', parseFloat(e.target.value) || 0)}
                    className="block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addContributor}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Contributor
        </button>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            Create Split Payment
          </button>
        </div>
      </form>
    </div>
  );
}