import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Landlord Pages
import LandlordLogin from './pages/landlord/Login';
import LandlordDashboard from './pages/landlord/Dashboard';
import LandlordCustomers from './pages/landlord/Customers';
import LandlordPayments from './pages/landlord/Payments';

// Tenant Pages
import TenantPayment from './pages/tenant/Payment';
import TenantHistory from './pages/tenant/History';

// Components
import { Navigation } from './components/common/Navigation';
import { Footer } from './components/common/Footer';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navigation />
        
        <main className="flex-grow">
          <Routes>
            {/* Home Route */}
            <Route path="/" element={<HomePage />} />
            
            {/* Landlord Routes */}
            <Route path="/landlord/login" element={<LandlordLogin />} />
            <Route path="/landlord/dashboard" element={<LandlordDashboard />} />
            <Route path="/landlord/customers" element={<LandlordCustomers />} />
            <Route path="/landlord/payments" element={<LandlordPayments />} />
            
            {/* Tenant Routes */}
            <Route path="/tenant/payment" element={<TenantPayment />} />
            <Route path="/tenant/history" element={<TenantHistory />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

// Home page component
const HomePage = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          GetTRX Payment Processing
        </h1>
        <p className="text-xl text-gray-600 mb-10">
          A complete solution for property payment processing
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold mb-4 text-blue-600">Landlords</h2>
            <p className="text-gray-600 mb-6">
              Accept payments, manage tenants, and track transactions
            </p>
            <Link 
              to="/landlord/login" 
              className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Landlord Login
            </Link>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold mb-4 text-green-600">Tenants</h2>
            <p className="text-gray-600 mb-6">
              Make payments quickly and securely to your landlord
            </p>
            <Link 
              to="/tenant/payment" 
              className="inline-block px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              Make a Payment
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;