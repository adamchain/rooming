import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Dashboard from './pages/Dashboard';
import AssetManager from './modules/asset-manager/src/App';
import QuickbooksIntegration from './modules/quickbooks/src/App';
import PaymentProcessing from './modules/gettrx/src/App';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="assets/*" element={<AssetManager />} />
          <Route path="quickbooks/*" element={<QuickbooksIntegration />} />
          <Route path="payments/*" element={<PaymentProcessing />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;