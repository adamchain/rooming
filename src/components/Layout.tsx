import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import {
  Home,
  Building2,
  Wrench,
  Users,
  Phone,
  DollarSign,
  Library,
  Bell,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Dashboard', icon: Home, href: '/dashboard' },
    { name: 'Properties', icon: Building2, href: '/dashboard/properties' },
    { name: 'Maintenance', icon: Wrench, href: '/dashboard/maintenance' },
    { name: 'Tenants', icon: Users, href: '/dashboard/tenants' },
    { name: 'Contacts', icon: Phone, href: '/dashboard/contacts' },
    { name: 'Financials', icon: DollarSign, href: '/dashboard/financials' },
    { 
      name: 'Document Hub', 
      icon: Library, 
      href: '/dashboard/documents',
      className: 'mt-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white'
    },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="flex h-full flex-col bg-black w-64 fixed left-0 top-0">
      <div className="flex h-16 items-center gap-2 px-6">
        <img src="/rooming-logo.png" alt="Rooming" className="h-8 w-8" />
        <span className="text-xl font-semibold text-white">Rooming</span>
      </div>
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-900 hover:text-white ${item.className || ''}`}
          >
            <item.icon className="mr-3 h-6 w-6 flex-shrink-0" />
            {item.name}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleSignOut}
          className="w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-900 hover:text-white"
        >
          <LogOut className="mr-3 h-6 w-6" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

const Header = () => {
  const { user } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <div className="flex h-16 items-center justify-end gap-4 px-4">
        <button className="relative p-2 text-gray-600 hover:text-gray-900">
          <Bell className="h-6 w-6" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
        </button>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-sm font-medium text-black">{user?.email}</span>
            <span className="text-xs text-gray-500">Property Manager</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <div className="pl-64">
        <Header />
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}