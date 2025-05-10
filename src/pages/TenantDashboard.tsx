import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RentPaymentForm from '../components/RentPaymentForm';
import { Building2, LogOut } from 'lucide-react';

export default function TenantDashboard() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [error, setError] = React.useState<string | null>(null);

  const handleSignOut = async () => {
    if (signOut) {
      await signOut();
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">
                Tenant Portal
              </span>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleSignOut}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <LogOut className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-center">
          <RentPaymentForm
            amount={1500}
            onSuccess={() => {
              alert('Payment successful!');
            }}
            onError={(error) => setError(error)}
            setupRecurring
          />
        </div>
      </main>
    </div>
  );
}