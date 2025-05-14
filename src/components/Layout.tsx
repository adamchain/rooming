import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Home, Building2, Users, Wrench, FileText, CreditCard, DollarSign, Phone, TrendingUp } from 'lucide-react';

const navigationItems = [
  { id: 'dashboard', icon: Home, label: 'Dashboard', path: '/dashboard' },
  { id: 'properties', icon: Building2, label: 'Properties', path: '/dashboard/properties' },
  { id: 'tenants', icon: Users, label: 'Tenants', path: '/dashboard/tenants' },
  { id: 'maintenance', icon: Wrench, label: 'Maintenance', path: '/dashboard/maintenance' },
  { id: 'documents', icon: FileText, label: 'Documents', path: '/dashboard/documents' },
  { id: 'payments', icon: CreditCard, label: 'Payments', path: '/dashboard/payments' },
  { id: 'financials', icon: DollarSign, label: 'Financials', path: '/dashboard/financials' },
  { id: 'contacts', icon: Phone, label: 'Contacts', path: '/dashboard/contacts' },
  { id: 'assets', icon: TrendingUp, label: 'Assets', path: '/dashboard/assets' }
];

export const Layout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <nav className="w-64 bg-white shadow-lg">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-gray-800">Property Manager</h1>
        </div>
        <ul className="space-y-2 p-4">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8">
        <Outlet />
      </main>
    </div>
  );
};