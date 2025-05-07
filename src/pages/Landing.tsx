import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Key, Shield, BarChart as ChartBar, Users, Wrench } from 'lucide-react';
import Auth from '../components/Auth';

export default function Landing() {
  const navigate = useNavigate();
  const [showAuth, setShowAuth] = useState(false);
  const [authRole, setAuthRole] = useState<'tenant' | 'landlord'>('tenant');

  const handleAuthClick = (role: 'tenant' | 'landlord') => {
    setAuthRole(role);
    setShowAuth(true);
  };

  return (
    <div className="min-h-screen bg-[#161c2c]">
      {/* Navigation */}
      <nav className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <img src="/rooming-logo.png" alt="Rooming" className="h-8 w-8" />
              <span className="ml-3 text-xl font-medium text-white">Rooming</span>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => handleAuthClick('tenant')}
                className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium"
              >
                Sign in
              </button>
              <button
                onClick={() => handleAuthClick('landlord')}
                className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Get started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 text-center">
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white mb-8">
            Property management for the
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500"> modern era</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-400 mb-12">
            Streamline your property operations with our comprehensive platform. From tenant management to maintenance tracking, we've got you covered.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => handleAuthClick('tenant')}
              className="inline-flex items-center px-6 py-3 text-base font-medium rounded-lg text-gray-300 bg-[#1e2433] hover:bg-[#252d40] transition-colors"
            >
              <Key className="h-5 w-5 mr-2" />
              Tenant Portal
            </button>
            <button
              onClick={() => handleAuthClick('landlord')}
              className="inline-flex items-center px-6 py-3 text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              <Building2 className="h-5 w-5 mr-2" />
              Property Owner Dashboard
            </button>
          </div>
        </div>

        {/* Gradient Orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-30 pointer-events-none">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/30 to-purple-500/30 blur-3xl" />
        </div>
      </div>

      {/* Features Grid */}
      <div className="relative bg-[#1e2433] py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              Everything you need to manage properties
            </h2>
            <p className="text-lg text-gray-400">
              Powerful tools for both property owners and tenants
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Secure Tenant Portal',
                description: 'Give tenants a dedicated space to manage rent payments, maintenance requests, and documents.',
                color: 'bg-blue-500/10',
                iconColor: 'text-blue-500'
              },
              {
                icon: ChartBar,
                title: 'Financial Tracking',
                description: 'Track rent payments, expenses, and generate comprehensive financial reports.',
                color: 'bg-purple-500/10',
                iconColor: 'text-purple-500'
              },
              {
                icon: Wrench,
                title: 'Maintenance Management',
                description: 'Streamline maintenance requests and track repairs from start to finish.',
                color: 'bg-red-500/10',
                iconColor: 'text-red-500'
              },
              {
                icon: Users,
                title: 'Tenant Screening',
                description: 'Comprehensive tenant screening and application management tools.',
                color: 'bg-green-500/10',
                iconColor: 'text-green-500'
              },
              {
                icon: Building2,
                title: 'Property Analytics',
                description: 'Get insights into property performance and occupancy rates.',
                color: 'bg-yellow-500/10',
                iconColor: 'text-yellow-500'
              },
              {
                icon: Key,
                title: 'Access Control',
                description: 'Manage access permissions and track entry logs for enhanced security.',
                color: 'bg-indigo-500/10',
                iconColor: 'text-indigo-500'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-[#252d40] p-6 rounded-xl hover:bg-[#2a324a] transition-colors"
              >
                <div className={`${feature.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                  <feature.icon className={`h-6 w-6 ${feature.iconColor}`} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-[#161c2c] py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-8 md:p-12 shadow-xl">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to streamline your property management?
              </h2>
              <p className="text-lg text-white/90 mb-8">
                Join thousands of property owners who trust Rooming to manage their properties.
              </p>
              <button
                onClick={() => handleAuthClick('landlord')}
                className="inline-flex items-center px-6 py-3 text-base font-medium rounded-lg text-blue-600 bg-white hover:bg-gray-50 transition-colors"
              >
                Get started now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      {showAuth && (
        <Auth
          defaultRole={authRole}
          onAuthSuccess={() => {
            setShowAuth(false);
            navigate(authRole === 'tenant' ? '/tenant/dashboard' : '/dashboard');
          }}
          onClose={() => setShowAuth(false)}
        />
      )}
    </div>
  );
}