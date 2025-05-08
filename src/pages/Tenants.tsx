import React, { useState, useEffect } from 'react';
import { Users, Plus, Pencil, Trash2, AlertCircle, UserPlus, X } from 'lucide-react';
import tenantService from '../services/tenantService';
import propertyService from '../services/propertyService';
import tenantInviteService from '../services/tenantInviteService';
import TenantInviteForm from '../components/TenantInviteForm';
import { formatCurrency } from '../utils/formatters';

export default function Tenants() {
  const [tenants, setTenants] = useState([]);
  const [properties, setProperties] = useState([]);
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState('');
  const [editingTenant, setEditingTenant] = useState(null);
  const [newTenant, setNewTenant] = useState({
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

  const handleAddTenant = async (e) => {
    e.preventDefault();
    try {
      if (!newTenant.property_id || !newTenant.name || !newTenant.email) {
        setError('Please fill in all required fields');
        return;
      }

      await tenantService.addTenant(newTenant);
      setShowAddModal(false);
      setNewTenant({
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
      loadData();
    } catch (err) {
      setError('Failed to add tenant');
      console.error(err);
    }
  };

  const handleUpdateTenant = async (e) => {
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

  const handleDeleteTenant = async (id) => {
    if (!confirm('Are you sure you want to delete this tenant?')) return;

    try {
      await tenantService.deleteTenant(id);
      loadData();
    } catch (err) {
      setError('Failed to delete tenant');
      console.error(err);
    }
  };

  const handleDeleteInvite = async (id) => {
    if (!confirm('Are you sure you want to delete this invite?')) return;

    try {
      await tenantInviteService.deleteInvite(id);
      loadData();
    } catch (err) {
      setError('Failed to delete invite');
      console.error(err);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: 'bg-yellow-100 dark:bg-yellow-900/20', text: 'text-yellow-800 dark:text-yellow-300' },
      accepted: { bg: 'bg-green-100 dark:bg-green-900/20', text: 'text-green-800 dark:text-green-300' },
      rejected: { bg: 'bg-red-100 dark:bg-red-900/20', text: 'text-red-800 dark:text-red-300' }
    };

    const config = statusConfig[status] || { bg: 'bg-gray-100 dark:bg-gray-700/30', text: 'text-gray-800 dark:text-gray-300' };

    return `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-t-[#0078d4] border-r-[#0078d4] border-b-transparent border-l-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Tenants</h1>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowInviteModal(true)}
            className="inline-flex items-center px-4 py-2 border border-[#0078d4] text-[#0078d4] hover:bg-[#0078d4] hover:text-white font-medium rounded transition-colors"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Invite Tenant
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 bg-[#0078d4] hover:bg-[#106ebe] text-white font-medium rounded transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Tenant
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-300">{error}</h3>
            </div>
          </div>
        </div>
      )}

      {/* Pending Invites */}
      {invites.length > 0 && (
        <div className="bg-white dark:bg-[#252525] rounded border border-gray-200 dark:border-[#3b3b3b] overflow-hidden transition-colors duration-200">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-[#3b3b3b]">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Pending Invites</h2>
          </div>
          <div>
            <ul className="divide-y divide-gray-200 dark:divide-[#3b3b3b]">
              {invites.map((invite) => (
                <li key={invite.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-[#2d2d2d] transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{invite.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{invite.phone}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {invite.property?.name || invite.property?.address}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={getStatusBadge(invite.status)}>
                        {invite.status}
                      </span>
                      <button
                        onClick={() => handleDeleteInvite(invite.id)}
                        className="text-red-600 dark:text-red-500 hover:text-red-800 dark:hover:text-red-400 transition-colors"
                        aria-label="Delete invite"
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
      <div className="bg-white dark:bg-[#252525] rounded border border-gray-200 dark:border-[#3b3b3b] overflow-hidden transition-colors duration-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-[#3b3b3b]">
            <thead className="bg-gray-50 dark:bg-[#1b1b1b]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Tenant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Property
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Lease Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Rent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-[#252525] divide-y divide-gray-200 dark:divide-[#3b3b3b]">
              {tenants.map((tenant) => (
                <tr key={tenant.id} className="hover:bg-gray-50 dark:hover:bg-[#2d2d2d] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#0078d4]/10 flex items-center justify-center text-[#0078d4]">
                        <Users className="h-5 w-5" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {tenant.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{tenant.email}</div>
                        {tenant.phone && (
                          <div className="text-sm text-gray-500 dark:text-gray-400">{tenant.phone}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {tenant.property?.name || 'Unnamed Property'}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {tenant.property?.address}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {new Date(tenant.lease_start).toLocaleDateString()} -
                      {new Date(tenant.lease_end).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {formatCurrency(tenant.rent_amount)}/month
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Deposit: {formatCurrency(tenant.security_deposit)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <button
                      onClick={() => setEditingTenant(tenant)}
                      className="text-[#0078d4] hover:text-[#106ebe] mr-4 transition-colors"
                      aria-label="Edit tenant"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteTenant(tenant.id)}
                      className="text-red-600 dark:text-red-500 hover:text-red-800 dark:hover:text-red-400 transition-colors"
                      aria-label="Delete tenant"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Tenant Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-[#252525] rounded p-6 max-w-md w-full border border-gray-200 dark:border-[#3b3b3b] shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Invite New Tenant</h2>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Property
              </label>
              <select
                value={selectedProperty}
                onChange={(e) => setSelectedProperty(e.target.value)}
                required
                className="w-full bg-white dark:bg-[#1b1b1b] border border-gray-300 dark:border-[#3b3b3b] rounded p-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0078d4] focus:border-transparent"
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
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-[#252525] rounded p-6 max-w-2xl w-full border border-gray-200 dark:border-[#3b3b3b] shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                {editingTenant ? 'Edit Tenant' : 'Add New Tenant'}
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingTenant(null);
                }}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={editingTenant ? handleUpdateTenant : handleAddTenant} className="mt-2">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
                    className="w-full bg-white dark:bg-[#1b1b1b] border border-gray-300 dark:border-[#3b3b3b] rounded p-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0078d4] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
                    className="w-full bg-white dark:bg-[#1b1b1b] border border-gray-300 dark:border-[#3b3b3b] rounded p-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0078d4] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={editingTenant?.phone || newTenant.phone}
                    onChange={(e) => editingTenant
                      ? setEditingTenant({ ...editingTenant, phone: e.target.value })
                      : setNewTenant({ ...newTenant, phone: e.target.value })
                    }
                    className="w-full bg-white dark:bg-[#1b1b1b] border border-gray-300 dark:border-[#3b3b3b] rounded p-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0078d4] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Property
                  </label>
                  <select
                    value={editingTenant?.property_id || newTenant.property_id}
                    onChange={(e) => editingTenant
                      ? setEditingTenant({ ...editingTenant, property_id: e.target.value })
                      : setNewTenant({ ...newTenant, property_id: e.target.value })
                    }
                    required
                    className="w-full bg-white dark:bg-[#1b1b1b] border border-gray-300 dark:border-[#3b3b3b] rounded p-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0078d4] focus:border-transparent"
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
                    className="w-full bg-white dark:bg-[#1b1b1b] border border-gray-300 dark:border-[#3b3b3b] rounded p-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0078d4] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
                    className="w-full bg-white dark:bg-[#1b1b1b] border border-gray-300 dark:border-[#3b3b3b] rounded p-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0078d4] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
                    className="w-full bg-white dark:bg-[#1b1b1b] border border-gray-300 dark:border-[#3b3b3b] rounded p-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0078d4] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
                    className="w-full bg-white dark:bg-[#1b1b1b] border border-gray-300 dark:border-[#3b3b3b] rounded p-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0078d4] focus:border-transparent"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={editingTenant?.notes || newTenant.notes}
                    onChange={(e) => editingTenant
                      ? setEditingTenant({ ...editingTenant, notes: e.target.value })
                      : setNewTenant({ ...newTenant, notes: e.target.value })
                    }
                    rows={3}
                    className="w-full bg-white dark:bg-[#1b1b1b] border border-gray-300 dark:border-[#3b3b3b] rounded p-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0078d4] focus:border-transparent"
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
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#1b1b1b] border border-gray-300 dark:border-[#3b3b3b] rounded hover:bg-gray-50 dark:hover:bg-[#292929] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-[#0078d4] hover:bg-[#106ebe] rounded transition-colors"
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