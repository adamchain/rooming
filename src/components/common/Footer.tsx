import React from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Mail, Phone } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company info */}
          <div>
            <div className="flex items-center">
              <CreditCard className="h-8 w-8 text-blue-400" />
              <span className="ml-2 text-xl font-bold">GetTRX Payments</span>
            </div>
            <p className="mt-4 text-gray-300 text-sm">
              Seamless payment processing solution for property management, connecting landlords and tenants with secure, reliable payment options.
            </p>
          </div>
          
          {/* Quick links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/landlord/login" className="text-gray-300 hover:text-white transition-colors">
                  Landlord Login
                </Link>
              </li>
              <li>
                <Link to="/tenant/payment" className="text-gray-300 hover:text-white transition-colors">
                  Make a Payment
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-gray-300">(888) 775-1500</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-gray-400 mr-2" />
                <a href="mailto:support@gettrx.com" className="text-gray-300 hover:text-white transition-colors">
                  support@gettrx.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} GetTRX Payments. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};