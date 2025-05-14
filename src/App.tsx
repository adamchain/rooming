import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Dashboard from './pages/Dashboard';
import Properties from './pages/Properties';
import Tenants from './pages/Tenants';
import Maintenance from './pages/Maintenance';
import Documents from './pages/Documents';
import Payments from './pages/Payments';
import PaymentLink from './pages/PaymentLink';
import Financials from './pages/Financials';
import Contacts from './pages/Contacts';
import Landing from './pages/Landing';
import TenantDashboard from './pages/TenantDashboard';
import AssetManager from './pages/AssetManager';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/pay/:paymentId" element={<PaymentLink />} />
          <Route path="/tenant/dashboard" element={<TenantDashboard />} />
          <Route path="/dashboard" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="properties" element={<Properties />} />
            <Route path="tenants" element={<Tenants />} />
            <Route path="maintenance" element={<Maintenance />} />
            <Route path="documents" element={<Documents />} />
            <Route path="payments" element={<Payments />} />
            <Route path="financials" element={<Financials />} />
            <Route path="contacts" element={<Contacts />} />
            <Route path="assets" element={<AssetManager />} />
            <Route path="settings" element={<div>Settings Page</div>} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;