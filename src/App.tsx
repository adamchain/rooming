import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout';
import Dashboard from './pages/Dashboard';
import Properties from './pages/Properties';
import Tenants from './pages/Tenants';
import Maintenance from './pages/Maintenance';
import Payments from './pages/Payments';
import Financials from './pages/Financials';
import Documents from './pages/Documents';
import Contacts from './pages/Contacts';
import AssetManager from './modules/asset-manager/src/App';
import QuickbooksIntegration from './modules/quickbooks/src/App';
import PaymentProcessing from './modules/gettrx/src/App';
import TenantDashboard from './pages/TenantDashboard';
import TenantInvite from './pages/TenantInvite';
import TenantSignup from './pages/TenantSignup';
import PaymentLink from './pages/PaymentLink';
import Landing from './pages/Landing';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/tenant/signup" element={<TenantSignup />} />
        <Route path="/tenant/invite/:token" element={<TenantInvite />} />
        <Route path="/tenant/dashboard" element={<TenantDashboard />} />
        <Route path="/pay/:paymentId" element={<PaymentLink />} />
        
        <Route path="/" element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="properties" element={<Properties />} />
          <Route path="tenants" element={<Tenants />} />
          <Route path="maintenance" element={<Maintenance />} />
          <Route path="payments" element={<Payments />} />
          <Route path="financials" element={<Financials />} />
          <Route path="documents" element={<Documents />} />
          <Route path="contacts" element={<Contacts />} />
          
          {/* Module routes */}
          <Route path="assets/*" element={<AssetManager />} />
          <Route path="quickbooks/*" element={<QuickbooksIntegration />} />
          <Route path="payments/*" element={<PaymentProcessing />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;