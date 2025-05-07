import React, { useState, useEffect } from 'react';
import { Wrench, Plus, Pencil, Trash2, AlertCircle } from 'lucide-react';
import maintenanceService from '../services/maintenanceService';
import propertyService from '../services/propertyService';
import tenantService from '../services/tenantService';
import { formatCurrency } from '../utils/formatters';

interface MaintenanceRequest {
  id: string;
  property_id: string;
  tenant_id?: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  estimated_cost?: number;
  actual_cost?: number;
  scheduled_date?: string;
  completed_date?: string;
  notes?: string;
  created_at: string;
  property?: {
    id: string;
    name: string | null;
    address: string;
  };
  tenant?: {
    id: string;
    name: string;
    email: string;
  };
}

interface Property {
  id: string;
  name: string | null;
  address: string;
}

interface Tenant {
  id: string;
  name: string;
  email: string;
  property_id: string;
}

export default function Maintenance() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRequest, setEditingRequest] = useState<MaintenanceRequest | null>(null);
  const [newRequest, setNewRequest] = useState<Partial<MaintenanceRequest>>({
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    property_id: '',
  });
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('');

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

  const handleAddRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!newRequest.property_id || !newRequest.title || !newRequest.description) {
        setError('Please fill in all required fields');
        return;
      }

      await maintenanceService.addMaintenanceRequest(newRequest as Required<MaintenanceRequest>);
      setShowAddModal(false);
      setNewRequest({});
      loadData();
    } catch (err) {
      setError('Failed to add maintenance request');
      console.error(err);
    }
  };

  const handleUpdateRequest = async (e: React.FormEvent) => {
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

  const handleDeleteRequest = async (id: string) => {
    if (!confirm('Are you sure you want to delete this maintenance request?')) return;

    try {
      await maintenanceService.deleteMaintenanceRequest(id);
      loadData();
    } catch (err) {
      setError('Failed to delete maintenance request');
      console.error(err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
        <h1 className="text-2xl font-semibold text-gray-900">Maintenance Requests</h1>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Request
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

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Request
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Property
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cost
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {requests.map((request) => (
              <tr key={request.id}>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {request.title}
                  </div>
                  <div className="text-sm text-gray-500">
                    {request.description}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {request.property?.name || 'Unnamed Property'}
                  </div>
                  <div className="text-sm text-gray-500">
                    {request.property?.address}
                  </div>
                  {request.tenant && (
                    <div className="text-xs text-gray-500 mt-1">
                      Tenant: {request.tenant.name}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                    {request.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                    {request.priority}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {request.actual_cost ? (
                    <div className="text-sm text-gray-900">
                      {formatCurrency(request.actual_cost)}
                    </div>
                  ) : request.estimated_cost ? (
                    <div className="text-sm text-gray-500">
                      Est. {formatCurrency(request.estimated_cost)}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">-</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => setEditingRequest(request)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteRequest(request.id)}
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

      {/* Add/Edit Maintenance Request Modal */}
      {(showAddModal || editingRequest) && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <h2 className="text-lg font-semibold mb-4">
              {editingRequest ? 'Edit Maintenance Request' : 'Add New Maintenance Request'}
            </h2>
            <form onSubmit={editingRequest ? handleUpdateRequest : handleAddRequest}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
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
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
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
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
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
                    Tenant
                  </label>
                  <select
                    value={editingRequest?.tenant_id || newRequest.tenant_id}
                    onChange={(e) => editingRequest
                      ? setEditingRequest({ ...editingRequest, tenant_id: e.target.value || undefined })
                      : setNewRequest({ ...newRequest, tenant_id: e.target.value || undefined })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                  <label className="block text-sm font-medium text-gray-700">
                    Priority
                  </label>
                  <select
                    value={editingRequest?.priority || newRequest.priority}
                    onChange={(e) => editingRequest
                      ? setEditingRequest({ ...editingRequest, priority: e.target.value as MaintenanceRequest['priority'] })
                      : setNewRequest({ ...newRequest, priority: e.target.value as MaintenanceRequest['priority'] })
                    }
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    value={editingRequest?.status || newRequest.status}
                    onChange={(e) => editingRequest
                      ? setEditingRequest({ ...editingRequest, status: e.target.value as MaintenanceRequest['status'] })
                      : setNewRequest({ ...newRequest, status: e.target.value as MaintenanceRequest['status'] })
                    }
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
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
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
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
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Scheduled Date
                  </label>
                  <input
                    type="date"
                    value={editingRequest?.scheduled_date || newRequest.scheduled_date || ''}
                    onChange={(e) => editingRequest
                      ? setEditingRequest({ ...editingRequest, scheduled_date: e.target.value || undefined })
                      : setNewRequest({ ...newRequest, scheduled_date: e.target.value || undefined })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Completed Date
                  </label>
                  <input
                    type="date"
                    value={editingRequest?.completed_date || newRequest.completed_date || ''}
                    onChange={(e) => editingRequest
                      ? setEditingRequest({ ...editingRequest, completed_date: e.target.value || undefined })
                      : setNewRequest({ ...newRequest, completed_date: e.target.value || undefined })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Notes
                  </label>
                  <textarea
                    value={editingRequest?.notes || newRequest.notes || ''}
                    onChange={(e) => editingRequest
                      ? setEditingRequest({ ...editingRequest, notes: e.target.value || undefined })
                      : setNewRequest({ ...newRequest, notes: e.target.value || undefined })
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
                    setEditingRequest(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
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