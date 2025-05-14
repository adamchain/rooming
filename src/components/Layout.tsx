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

export default navigationItems;