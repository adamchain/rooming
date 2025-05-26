import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';

// Landlord Pages
import LandlordLogin from './src/pages/landlord/Login';
import LandlordDashboard from './src/pages/landlord/Dashboard';
import LandlordCustomers from './src/pages/landlord/Customers';
import LandlordPayments from './src/pages/landlord/Payments';

// Tenant Pages
import TenantPayment from './src/pages/tenant/Payment';
import TenantHistory from './src/pages/tenant/History';

function PaymentProcessing() {
  const location = useLocation();
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Payment Processing</h1>
      
      <div className="bg-white dark:bg-[#252525] rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-[#252525] rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow border dark:border-[#3b3b3b]">
            <h2 className="text-2xl font-semibold mb-4 text-blue-600 dark:text-blue-400">Landlords</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Accept payments, manage tenants, and track transactions
            </p>
            <Link 
              to="/payments/landlord/dashboard" 
              className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Landlord Dashboard
            </Link>
          </div>
          
          <div className="bg-white dark:bg-[#252525] rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow border dark:border-[#3b3b3b]">
            <h2 className="text-2xl font-semibold mb-4 text-green-600 dark:text-green-400">Tenants</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Make payments quickly and securely to your landlord
            </p>
            <Link 
              to="/payments/tenant/payment" 
              className="inline-block px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              Make a Payment
            </Link>
          </div>
        </div>
      </div>
      
      <Routes>
        <Route path="/landlord/dashboard" element={<LandlordDashboard />} />
        <Route path="/landlord/customers" element={<LandlordCustomers />} />
        <Route path="/landlord/payments" element={<LandlordPayments />} />
        <Route path="/tenant/payment" element={<TenantPayment />} />
        <Route path="/tenant/history" element={<TenantHistory />} />
      </Routes>
    </div>
  );
}

export default PaymentProcessing;