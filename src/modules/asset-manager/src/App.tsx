import React from 'react';
import { Dashboard } from './components/Dashboard';

function AssetManager() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Asset Manager</h1>
      <Dashboard />
    </div>
  );
}

export default AssetManager;