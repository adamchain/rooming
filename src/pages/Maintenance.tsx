import React, { useState, useEffect } from 'react';
import { Wrench, Plus, Pencil, Trash2, AlertCircle, X } from 'lucide-react';
import maintenanceService from '../services/maintenanceService';
import propertyService from '../services/propertyService';
import tenantService from '../services/tenantService';
import { formatCurrency } from '../utils/formatters';

export default function Maintenance() {
  const [requests, setRequests] = useState([]);
  const [properties, setProperties] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);
  const [newRequest, setNewRequest] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    property_id: '',
  });
  const [selectedPropertyId, setSelectedPropertyId] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [requestsData, propertiesData, tenantsData] = await Promise.all([
        maintenanceService.getMaintenanceRequests(),
        propertyService.getProperties(),
        tenantService.getTenants()
      ]);
      setRequests(requestsData);
      setProperties(propertiesData);
      setTenants(tenantsData);
      setError(null);
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRequest = async (e) => {
    e.preventDefault();
    try {
      if (!newRequest.property_id || !newRequest.title || !newRequest.description) {
        setError('Please fill in all required fields');
        return;
      }

      await maintenanceService.addMaintenanceRequest(newRequest);
      setShowAddModal(false);
      setNewRequest({
        title: '',
        description: '',
        priority: 'medium',
        status: 'pending',
        property_id: '',
      });
      loadData();
    } catch (err) {
      setError('Failed to add maintenance request');
      console.error(err);
    }
  };

  const handleUpdateRequest = async (e) => {
    e.preventDefault();
    if (!editingRequest) return;

    try {
      await maintenanceService.updateMaintenanceRequest(editingRequest.id, editingRequest);
      setEditingRequest(null);
      loadData();
    } catch (err) {
      setError('Failed to update maintenance request');
      console.error(err);
    }
  };

  const handleDeleteRequest = async (id) => {
    if (!confirm('Are you sure you want to delete this maintenance request?')) return;

    try {
      await maintenanceService.deleteMaintenanceRequest(id);
      loadData();
    } catch (err) {
      setError('Failed to delete maintenance request');
      console.error(err);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: 'bg-yellow-100 dark:bg-yellow-900/20', text: 'text-yellow-800 dark:text-yellow-300' },
      in_progress: { bg: 'bg-blue-100 dark:bg-blue-900/20', text: 'text-blue-800 dark:text-blue-300' },
      completed: { bg: 'bg-green-100 dark:bg-green-900/20', text: 'text-green-800 dark:text-green-300' },
      cancelled: { bg: 'bg-gray-100 dark:bg-gray-700/30', text: 'text-gray-800 dark:text-gray-300' }
    };

    const config = statusConfig[status] || { bg: 'bg-gray-100 dark:bg-gray-700/30', text: 'text-gray-800 dark:text-gray-300' };

    return `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`;
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      urgent: { bg: 'bg-red-100 dark:bg-red-900/20', text: 'text-red-800 dark:text-red-300' },
      high: { bg: 'bg-orange-100 dark:bg-orange-900/20', text: 'text-orange-800 dark:text-orange-300' },
      medium: { bg: 'bg-yellow-100 dark:bg-yellow-900/20', text: 'text-yellow-800 dark:text-yellow-300' },
      low: { bg: 'bg-green-100 dark:bg-green-900/20', text: 'text-green-800 dark:text-green-300' }
    };

    const config = priorityConfig[priority] || { bg: 'bg-gray-100 dark:bg-gray-700/30', text: 'text-gray-800 dark:text-gray-300' };

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
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Maintenance Requests</h1>
        <div>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 bg-[#0078d4] hover:bg-[#106ebe] text-white font-medium rounded transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Request
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

      <div className="bg-white dark:bg-[#252525] rounded border border-gray-200 dark:border-[#3b3b3b] overflow-hidden transition-colors duration-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-[#3b3b3b]">
            <thead className="bg-gray-50 dark:bg-[#1b1b1b]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Request
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Property
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-[#252525] divide-y divide-gray-200 dark:divide-[#3b3b3b]">
              {requests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50 dark:hover:bg-[#2d2d2d] transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {request.title}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {request.description}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {request.property?.name || 'Unnamed Property'}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {request.property?.address}
                    </div>
                    {request.tenant && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Tenant: {request.tenant.name}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={getStatusBadge(request.status)}>
                      {request.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={getPriorityBadge(request.priority)}>
                      {request.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {request.actual_cost ? (
                      <div className="text-sm text-gray-900 dark:text-white">
                        {formatCurrency(request.actual_cost)}
                      </div>
                    ) : request.estimated_cost ? (
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Est. {formatCurrency(request.estimated_cost)}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 dark:text-gray-400">-</div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <button
                      onClick={() => setEditingRequest(request)}
                      className="text-[#0078d4] hover:text-[#106ebe] mr-4 transition-colors"
                      aria-label="Edit request"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteRequest(request.id)}
                      className="text-red-600 dark:text-red-500 hover:text-red-800 dark:hover:text-red-400 transition-colors"
                      aria-label="Delete request"
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

      {/* Add/Edit Maintenance Request Modal */}
      {(showAddModal || editingRequest) && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-[#252525] rounded p-6 max-w-2xl w-full border border-gray-200 dark:border-[#3b3b3b] shadow-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                {editingRequest ? 'Edit Maintenance Request' : 'Add New Maintenance Request'}
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingRequest(null);
                }}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={editingRequest ? handleUpdateRequest : handleAddRequest} className="mt-2">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={editingRequest?.title || newRequest.title}
                    onChange={(e) => editingRequest
                      ? setEditingRequest({ ...editingRequest, title: e.target.value })
                      : setNewRequest({ ...newRequest, title: e.target.value })
                    }
                    required
                    className="w-full bg-white dark:bg-[#1b1b1b] border border-gray-300 dark:border-[#3b3b3b] rounded p-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0078d4] focus:border-transparent"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={editingRequest?.description || newRequest.description}
                    onChange={(e) => editingRequest
                      ? setEditingRequest({ ...editingRequest, description: e.target.value })
                      : setNewRequest({ ...newRequest, description: e.target.value })
                    }
                    required
                    rows={3}
                    className="w-full bg-white dark:bg-[#1b1b1b] border border-gray-300 dark:border-[#3b3b3b] rounded p-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0078d4] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Property
                  </label>
                  <select
                    value={editingRequest?.property_id || selectedPropertyId}
                    onChange={(e) => {
                      const propertyId = e.target.value;
                      if (editingRequest) {
                        setEditingRequest({ ...editingRequest, property_id: propertyId });
                      } else {
                        setSelectedPropertyId(propertyId);
                        setNewRequest({ ...newRequest, property_id: propertyId });
                      }
                    }}
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
                    Tenant
                  </label>
                  <select
                    value={editingRequest?.tenant_id || newRequest.tenant_id || ''}
                    onChange={(e) => editingRequest
                      ? setEditingRequest({ ...editingRequest, tenant_id: e.target.value || undefined })
                      : setNewRequest({ ...newRequest, tenant_id: e.target.value || undefined })
                    }
                    className="w-full bg-white dark:bg-[#1b1b1b] border border-gray-300 dark:border-[#3b3b3b] rounded p-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0078d4] focus:border-transparent"
                  >
                    <option value="">Select a tenant</option>
                    {tenants
                      .filter(tenant => tenant.property_id === (editingRequest?.property_id || selectedPropertyId))
                      .map((tenant) => (
                        <option key={tenant.id} value={tenant.id}>
                          {tenant.name}
                        </option>
                      ))
                    }
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={editingRequest?.priority || newRequest.priority}
                    onChange={(e) => editingRequest
                      ? setEditingRequest({ ...editingRequest, priority: e.target.value })
                      : setNewRequest({ ...newRequest, priority: e.target.value })
                    }
                    required
                    className="w-full bg-white dark:bg-[#1b1b1b] border border-gray-300 dark:border-[#3b3b3b] rounded p-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0078d4] focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <select
                    value={editingRequest?.status || newRequest.status}
                    onChange={(e) => editingRequest
                      ? setEditingRequest({ ...editingRequest, status: e.target.value })
                      : setNewRequest({ ...newRequest, status: e.target.value })
                    }
                    required
                    className="w-full bg-white dark:bg-[#1b1b1b] border border-gray-300 dark:border-[#3b3b3b] rounded p-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0078d4] focus:border-transparent"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Estimated Cost
                  </label>
                  <input
                    type="number"
                    value={editingRequest?.estimated_cost || newRequest.estimated_cost || ''}
                    onChange={(e) => editingRequest
                      ? setEditingRequest({ ...editingRequest, estimated_cost: parseFloat(e.target.value) || undefined })
                      : setNewRequest({ ...newRequest, estimated_cost: parseFloat(e.target.value) || undefined })
                    }
                    min="0"
                    step="0.01"
                    className="w-full bg-white dark:bg-[#1b1b1b] border border-gray-300 dark:border-[#3b3b3b] rounded p-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0078d4] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Actual Cost
                  </label>
                  <input
                    type="number"
                    value={editingRequest?.actual_cost || newRequest.actual_cost || ''}
                    onChange={(e) => editingRequest
                      ? setEditingRequest({ ...editingRequest, actual_cost: parseFloat(e.target.value) || undefined })
                      : setNewRequest({ ...newRequest, actual_cost: parseFloat(e.target.value) || undefined })
                    }
                    min="0"
                    step="0.01"
                    className="w-full bg-white dark:bg-[#1b1b1b] border border-gray-300 dark:border-[#3b3b3b] rounded p-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0078d4] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Scheduled Date
                  </label>
                  <input
                    type="date"
                    value={editingRequest?.scheduled_date || newRequest.scheduled_date || ''}
                    onChange={(e) => editingRequest
                      ? setEditingRequest({ ...editingRequest, scheduled_date: e.target.value || undefined })
                      : setNewRequest({ ...newRequest, scheduled_date: e.target.value || undefined })
                    }
                    className="w-full bg-white dark:bg-[#1b1b1b] border border-gray-300 dark:border-[#3b3b3b] rounded p-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0078d4] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Completed Date
                  </label>
                  <input
                    type="date"
                    value={editingRequest?.completed_date || newRequest.completed_date || ''}
                    onChange={(e) => editingRequest
                      ? setEditingRequest({ ...editingRequest, completed_date: e.target.value || undefined })
                      : setNewRequest({ ...newRequest, completed_date: e.target.value || undefined })
                    }
                    className="w-full bg-white dark:bg-[#1b1b1b] border border-gray-300 dark:border-[#3b3b3b] rounded p-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0078d4] focus:border-transparent"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={editingRequest?.notes || newRequest.notes || ''}
                    onChange={(e) => editingRequest
                      ? setEditingRequest({ ...editingRequest, notes: e.target.value || undefined })
                      : setNewRequest({ ...newRequest, notes: e.target.value || undefined })
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
                    setEditingRequest(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#1b1b1b] border border-gray-300 dark:border-[#3b3b3b] rounded hover:bg-gray-50 dark:hover:bg-[#292929] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-[#0078d4] hover:bg-[#106ebe] rounded transition-colors"
                >
                  {editingRequest ? 'Save Changes' : 'Add Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}