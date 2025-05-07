import React, { useState, useEffect } from 'react';
import { Users, Plus, Pencil, Trash2, AlertCircle, UserPlus } from 'lucide-react';
import tenantService from '../services/tenantService';
import propertyService from '../services/propertyService';
import tenantInviteService from '../services/tenantInviteService';
import TenantInviteForm from '../components/TenantInviteForm';
import { formatCurrency } from '../utils/formatters';

interface Tenant {
  id: string;
  property_id: string;
  name: string;
  email: string;
  phone?: string;
  lease_start: string;
  lease_end: string;
  rent_amount: number;
  security_deposit: number;
  notes?: string;
  property?: {
    id: string;
    name: string | null;
    address: string;
  };
}

interface Property {
  id: string;
  name: string | null;
  address: string;
}

interface TenantInvite {
  id: string;
  name: string;
  phone: string;
  status: string;
  created_at: string;
  property?: {
    name: string | null;
    address: string;
  };
}

export default function Tenants() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [invites, setInvites] = useState<TenantInvite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<string>('');
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [newTenant, setNewTenant] = useState<Partial<Tenant>>({
    name: '',
    email: '',
    phone: '',
    property_id: '',
    lease_start: '',
    lease_end: '',
    rent_amount: 0,
    security_deposit: 0,
    notes: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [tenantsData, propertiesData, invitesData] = await Promise.all([
        tenantService.getTenants(),
        propertyService.getProperties(),
        tenantInviteService.getInvites()
      ]);
      setTenants(tenantsData);
      setProperties(propertiesData);
      setInvites(invitesData);
      setError(null);
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!newTenant.property_id || !newTenant.name || !newTenant.email) {
        setError('Please fill in all required fields');
        return;
      }

      await tenantService.addTenant(newTenant as Required<Tenant>);
      setShowAddModal(false);
      setNewTenant({});
      loadData();
    } catch (err) {
      setError('Failed to add tenant');
      console.error(err);
    }
  };

  const handleUpdateTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTenant) return;

    try {
      await tenantService.updateTenant(editingTenant.id, editingTenant);
      setEditingTenant(null);
      loadData();
    } catch (err) {
      setError('Failed to update tenant');
      console.error(err);
    }
  };

  const handleDeleteTenant = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tenant?')) return;

    try {
      await tenantService.deleteTenant(id);
      loadData();
    } catch (err) {
      setError('Failed to delete tenant');
      console.error(err);
    }
  };

  const handleDeleteInvite = async (id: string) => {
    if (!confirm('Are you sure you want to delete this invite?')) return;

    try {
      await tenantInviteService.deleteInvite(id);
      loadData();
    } catch (err) {
      setError('Failed to delete invite');
      console.error(err);
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
        <h1 className="text-2xl font-semibold text-gray-900">Tenants</h1>
        <div className="mt-4 sm:mt-0 space-x-3">
          <button
            onClick={() => setShowInviteModal(true)}
            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Invite Tenant
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Tenant
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      {/* Pending Invites */}
      {invites.length > 0 && (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900">Pending Invites</h2>
          </div>
          <div className="border-t border-gray-200">
            <ul className="divide-y divide-gray-200">
              {invites.map((invite) => (
                <li key={invite.id} className="px-4 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{invite.name}</p>
                      <p className="text-sm text-gray-500">{invite.phone}</p>
                      <p className="text-xs text-gray-500">
                        {invite.property?.name || invite.property?.address}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        invite.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : invite.status === 'accepted'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {invite.status}
                      </span>
                      <button
                        onClick={() => handleDeleteInvite(invite.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Tenants Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tenant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Property
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lease Period
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rent
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tenants.map((tenant) => (
              <tr key={tenant.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Users className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {tenant.name}
                      </div>
                      <div className="text-sm text-gray-500">{tenant.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {tenant.property?.name || 'Unnamed Property'}
                  </div>
                  <div className="text-sm text-gray-500">
                    {tenant.property?.address}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(tenant.lease_start).toLocaleDateString()} -
                    {new Date(tenant.lease_end).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {formatCurrency(tenant.rent_amount)}/month
                  </div>
                  <div className="text-sm text-gray-500">
                    Deposit: {formatCurrency(tenant.security_deposit)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => setEditingTenant(tenant)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteTenant(tenant.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Invite Tenant Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Invite New Tenant</h2>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Property
              </label>
              <select
                value={selectedProperty}
                onChange={(e) => setSelectedProperty(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Select a property</option>
                {properties.map((property) => (
                  <option key={property.id} value={property.id}>
                    {property.name || property.address}
                  </option>
                ))}
              </select>
            </div>

            {selectedProperty && (
              <TenantInviteForm
                propertyId={selectedProperty}
                onInviteSent={() => {
                  setShowInviteModal(false);
                  setSelectedProperty('');
                  loadData();
                }}
              />
            )}
          </div>
        </div>
      )}

      {/* Add/Edit Tenant Modal */}
      {(showAddModal || editingTenant) && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <h2 className="text-lg font-semibold mb-4">
              {editingTenant ? 'Edit Tenant' : 'Add New Tenant'}
            </h2>
            <form onSubmit={editingTenant ? handleUpdateTenant : handleAddTenant}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editingTenant?.name || newTenant.name}
                    onChange={(e) => editingTenant
                      ? setEditingTenant({ ...editingTenant, name: e.target.value })
                      : setNewTenant({ ...newTenant, name: e.target.value })
                    }
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editingTenant?.email || newTenant.email}
                    onChange={(e) => editingTenant
                      ? setEditingTenant({ ...editingTenant, email: e.target.value })
                      : setNewTenant({ ...newTenant, email: e.target.value })
                    }
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={editingTenant?.phone || newTenant.phone}
                    onChange={(e) => editingTenant
                      ? setEditingTenant({ ...editingTenant, phone: e.target.value })
                      : setNewTenant({ ...newTenant, phone: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Property
                  </label>
                  <select
                    value={editingTenant?.property_id || newTenant.property_id}
                    onChange={(e) => editingTenant
                      ? setEditingTenant({ ...editingTenant, property_id: e.target.value })
                      : setNewTenant({ ...newTenant, property_id: e.target.value })
                    }
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="">Select a property</option>
                    {properties.map((property) => (
                      <option key={property.id} value={property.id}>
                        {property.name || property.address}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Lease Start
                  </label>
                  <input
                    type="date"
                    value={editingTenant?.lease_start || newTenant.lease_start}
                    onChange={(e) => editingTenant
                      ? setEditingTenant({ ...editingTenant, lease_start: e.target.value })
                      : setNewTenant({ ...newTenant, lease_start: e.target.value })
                    }
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Lease End
                  </label>
                  <input
                    type="date"
                    value={editingTenant?.lease_end || newTenant.lease_end}
                    onChange={(e) => editingTenant
                      ? setEditingTenant({ ...editingTenant, lease_end: e.target.value })
                      : setNewTenant({ ...newTenant, lease_end: e.target.value })
                    }
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Monthly Rent
                  </label>
                  <input
                    type="number"
                    value={editingTenant?.rent_amount || newTenant.rent_amount}
                    onChange={(e) => editingTenant
                      ? setEditingTenant({ ...editingTenant, rent_amount: parseFloat(e.target.value) })
                      : setNewTenant({ ...newTenant, rent_amount: parseFloat(e.target.value) })
                    }
                    required
                    min="0"
                    step="0.01"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Security Deposit
                  </label>
                  <input
                    type="number"
                    value={editingTenant?.security_deposit || newTenant.security_deposit}
                    onChange={(e) => editingTenant
                      ? setEditingTenant({ ...editingTenant, security_deposit: parseFloat(e.target.value) })
                      : setNewTenant({ ...newTenant, security_deposit: parseFloat(e.target.value) })
                    }
                    required
                    min="0"
                    step="0.01"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Notes
                  </label>
                  <textarea
                    value={editingTenant?.notes || newTenant.notes}
                    onChange={(e) => editingTenant
                      ? setEditingTenant({ ...editingTenant, notes: e.target.value })
                      : setNewTenant({ ...newTenant, notes: e.target.value })
                    }
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingTenant(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  {editingTenant ? 'Save Changes' : 'Add Tenant'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}