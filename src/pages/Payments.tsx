import React, { useState, useEffect } from 'react';
import { CreditCard, DollarSign, AlertTriangle, Plus, FileText, ExternalLink, Users, Phone } from 'lucide-react';
import tenantService from '../services/tenantService';
import contactService from '../services/contactService';
import invoiceService from '../services/invoiceService';
import merchantService from '../services/merchantService';
import { formatCurrency } from '../utils/formatters';
import { format, isAfter } from 'date-fns';
import MerchantOnboarding from '../components/MerchantOnboarding';

interface Tenant {
  id: string;
  name: string;
  email: string;
  rent_amount: number;
  property?: {
    id: string;
    name: string | null;
    address: string;
  };
}

interface Contact {
  id: string;
  name: string;
  email?: string;
  company?: string;
  category?: {
    name: string;
  };
}

interface Invoice {
  id: string;
  tenant: {
    name: string;
    email: string;
  };
  property: {
    name: string | null;
    address: string;
  };
  items: Array<{
    description: string;
    amount: number;
  }>;
  total: number;
  due_date: string;
  status: 'pending' | 'paid' | 'overdue';
  payment_link: string;
  created_at: string;
}

type RecipientType = 'tenant' | 'contact';

export default function Payments() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateInvoice, setShowCreateInvoice] = useState(false);
  const [showMerchantOnboarding, setShowMerchantOnboarding] = useState(false);
  const [hasMerchantAccount, setHasMerchantAccount] = useState(false);
  const [recipientType, setRecipientType] = useState<RecipientType>('tenant');
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [newInvoice, setNewInvoice] = useState<{
    items: Array<{ description: string; amount: number }>;
    due_date: string;
  }>({
    items: [{ description: '', amount: 0 }],
    due_date: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
  });

  useEffect(() => {
    loadData();
    checkMerchantAccount();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [tenantsData, contactsData, invoicesData] = await Promise.all([
        tenantService.getTenants(),
        contactService.getContacts(),
        invoiceService.getInvoices(),
      ]);
      setTenants(tenantsData);
      setContacts(contactsData);
      setInvoices(invoicesData);
      
      // Check for overdue invoices
      const updatedInvoices = invoicesData.map(invoice => {
        if (invoice.status === 'pending' && isAfter(new Date(), new Date(invoice.due_date))) {
          return { ...invoice, status: 'overdue' };
        }
        return invoice;
      });
      setInvoices(updatedInvoices);
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const checkMerchantAccount = async () => {
    try {
      const account = await merchantService.getMerchantAccount();
      setHasMerchantAccount(!!account);
    } catch (err) {
      console.error('Error checking merchant account:', err);
      setHasMerchantAccount(false);
    }
  };

  const handleAddInvoiceItem = () => {
    setNewInvoice(prev => ({
      ...prev,
      items: [...prev.items, { description: '', amount: 0 }],
    }));
  };

  const handleRemoveInvoiceItem = (index: number) => {
    setNewInvoice(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleInvoiceItemChange = (index: number, field: 'description' | 'amount', value: string) => {
    setNewInvoice(prev => ({
      ...prev,
      items: prev.items.map((item, i) => {
        if (i === index) {
          return {
            ...item,
            [field]: field === 'amount' ? parseFloat(value) || 0 : value,
          };
        }
        return item;
      }),
    }));
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (recipientType === 'tenant' && !selectedTenant?.property) {
      setError('Please select a tenant');
      return;
    }

    if (recipientType === 'contact' && !selectedContact) {
      setError('Please select a contact');
      return;
    }

    try {
      if (recipientType === 'tenant' && selectedTenant && selectedTenant.property) {
        await invoiceService.createInvoice({
          tenant_id: selectedTenant.id,
          property_id: selectedTenant.property.id,
          items: newInvoice.items,
          due_date: newInvoice.due_date,
        });
      } else if (recipientType === 'contact' && selectedContact) {
        await invoiceService.createContactInvoice({
          contact_id: selectedContact.id,
          items: newInvoice.items,
          due_date: newInvoice.due_date,
        });
      }

      setShowCreateInvoice(false);
      setSelectedTenant(null);
      setSelectedContact(null);
      setNewInvoice({
        items: [{ description: '', amount: 0 }],
        due_date: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
      });
      loadData();
    } catch (err) {
      setError('Failed to create invoice');
      console.error(err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Payments & Invoices</h1>
        <div className="mt-4 sm:mt-0 space-x-3">
          {!hasMerchantAccount && (
            <button
              onClick={() => setShowMerchantOnboarding(true)}
              className="inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Set Up Payments
            </button>
          )}
          <button
            onClick={() => setShowCreateInvoice(true)}
            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Invoice
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      {/* Merchant Account Setup Modal */}
      {showMerchantOnboarding && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <MerchantOnboarding
              onComplete={() => {
                setShowMerchantOnboarding(false);
                setHasMerchantAccount(true);
              }}
            />
          </div>
        </div>
      )}

      {/* Invoices List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg font-medium text-gray-900">Recent Invoices</h2>
        </div>
        <ul className="divide-y divide-gray-200">
          {invoices.map((invoice) => (
            <li key={invoice.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <FileText className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">{invoice.tenant.name}</p>
                      <p className="text-sm text-gray-500">
                        {invoice.property.name || invoice.property.address}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-500">
                      Due: {format(new Date(invoice.due_date), 'MMM d, yyyy')}
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(invoice.total)}
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </span>
                    <a
                      href={invoice.payment_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Create Invoice Modal */}
      {showCreateInvoice && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <h2 className="text-lg font-semibold mb-4">Create New Invoice</h2>
            <form onSubmit={handleCreateInvoice}>
              <div className="space-y-4">
                {/* Recipient Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Invoice Recipient
                  </label>
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => {
                        setRecipientType('tenant');
                        setSelectedContact(null);
                      }}
                      className={`flex items-center px-4 py-2 rounded-md ${
                        recipientType === 'tenant'
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      <Users className="h-5 w-5 mr-2" />
                      Tenant
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setRecipientType('contact');
                        setSelectedTenant(null);
                      }}
                      className={`flex items-center px-4 py-2 rounded-md ${
                        recipientType === 'contact'
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      <Phone className="h-5 w-5 mr-2" />
                      Contact
                    </button>
                  </div>
                </div>

                {/* Recipient Selection */}
                {recipientType === 'tenant' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Select Tenant
                    </label>
                    <select
                      value={selectedTenant?.id || ''}
                      onChange={(e) => setSelectedTenant(tenants.find(t => t.id === e.target.value) || null)}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="">Select a tenant</option>
                      {tenants.map((tenant) => (
                        <option key={tenant.id} value={tenant.id}>
                          {tenant.name} - {tenant.property?.name || tenant.property?.address}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Select Contact
                    </label>
                    <select
                      value={selectedContact?.id || ''}
                      onChange={(e) => setSelectedContact(contacts.find(c => c.id === e.target.value) || null)}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="">Select a contact</option>
                      {contacts.map((contact) => (
                        <option key={contact.id} value={contact.id}>
                          {contact.name} {contact.company ? `- ${contact.company}` : ''} ({contact.category?.name})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={newInvoice.due_date}
                    onChange={(e) => setNewInvoice(prev => ({ ...prev, due_date: e.target.value }))}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Items
                  </label>
                  {newInvoice.items.map((item, index) => (
                    <div key={index} className="flex space-x-4 mb-2">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleInvoiceItemChange(index, 'description', e.target.value)}
                        placeholder="Description"
                        required
                        className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                      <input
                        type="number"
                        value={item.amount || ''}
                        onChange={(e) => handleInvoiceItemChange(index, 'amount', e.target.value)}
                        placeholder="Amount"
                        required
                        min="0"
                        step="0.01"
                        className="w-32 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveInvoiceItem(index)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddInvoiceItem}
                    className="mt-2 text-sm text-indigo-600 hover:text-indigo-900"
                  >
                    Add Item
                  </button>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-gray-700">Total</span>
                    <span className="text-gray-900">
                      {formatCurrency(
                        newInvoice.items.reduce((sum, item) => sum + item.amount, 0)
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateInvoice(false);
                    setSelectedTenant(null);
                    setSelectedContact(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  Create Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}