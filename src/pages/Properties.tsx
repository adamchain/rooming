import React, { useState, useEffect } from 'react';
import { Building2, Plus, Pencil, Trash2, AlertTriangle } from 'lucide-react';
import PropertyFeatures from '../components/PropertyFeatures';
import propertyService from '../services/propertyService';

export default function Properties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProperty, setNewProperty] = useState({ name: '', address: '' });
  const [editingProperty, setEditingProperty] = useState(null);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const data = await propertyService.getProperties();
      setProperties(data);
      setError(null);
    } catch (err) {
      setError('Failed to load properties');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProperty = async (e) => {
    e.preventDefault();
    try {
      if (!newProperty.address.trim()) {
        setError('Address is required');
        return;
      }

      await propertyService.addProperty(newProperty);
      setShowAddModal(false);
      setNewProperty({ name: '', address: '' });
      loadProperties();
    } catch (err) {
      setError('Failed to add property');
      console.error(err);
    }
  };

  const handleUpdateProperty = async (e) => {
    e.preventDefault();
    if (!editingProperty) return;

    try {
      if (!editingProperty.address.trim()) {
        setError('Address is required');
        return;
      }

      await propertyService.updateProperty(editingProperty.id, {
        name: editingProperty.name || undefined,
        address: editingProperty.address,
      });
      setEditingProperty(null);
      loadProperties();
    } catch (err) {
      setError('Failed to update property');
      console.error(err);
    }
  };

  const handleDeleteProperty = async (id) => {
    if (!confirm('Are you sure you want to delete this property?')) return;

    try {
      await propertyService.deleteProperty(id);
      loadProperties();
    } catch (err) {
      setError('Failed to delete property');
      console.error(err);
    }
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
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Properties</h1>
        <div>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 bg-[#0078d4] hover:bg-[#106ebe] text-white font-medium rounded transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Property
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-300">{error}</h3>
            </div>
          </div>
        </div>
      )}

      {/* Property Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {properties.map((property) => (
          <div key={property.id} className="bg-white dark:bg-[#252525] rounded border border-gray-200 dark:border-[#3b3b3b] transition-colors duration-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-[#0078d4]/10 text-[#0078d4]">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                      {property.name || 'Unnamed Property'}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{property.address}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingProperty(property)}
                    className="p-1 text-gray-400 dark:text-gray-500 hover:text-[#0078d4] dark:hover:text-[#0078d4] transition-colors"
                    aria-label="Edit property"
                  >
                    <Pencil className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteProperty(property.id)}
                    className="p-1 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-500 transition-colors"
                    aria-label="Delete property"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="mt-6">
                <PropertyFeatures propertyId={property.id} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Property Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-[#252525] rounded p-6 max-w-md w-full border border-gray-200 dark:border-[#3b3b3b] shadow-lg">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Add New Property</h2>
            <form onSubmit={handleAddProperty}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Property Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={newProperty.name}
                    onChange={(e) => setNewProperty({ ...newProperty, name: e.target.value })}
                    className="w-full bg-white dark:bg-[#1b1b1b] border border-gray-300 dark:border-[#3b3b3b] rounded p-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0078d4] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    value={newProperty.address}
                    onChange={(e) => setNewProperty({ ...newProperty, address: e.target.value })}
                    required
                    className="w-full bg-white dark:bg-[#1b1b1b] border border-gray-300 dark:border-[#3b3b3b] rounded p-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0078d4] focus:border-transparent"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#1b1b1b] border border-gray-300 dark:border-[#3b3b3b] rounded hover:bg-gray-50 dark:hover:bg-[#292929] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-[#0078d4] hover:bg-[#106ebe] rounded transition-colors"
                >
                  Add Property
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Property Modal */}
      {editingProperty && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-[#252525] rounded p-6 max-w-md w-full border border-gray-200 dark:border-[#3b3b3b] shadow-lg">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Edit Property</h2>
            <form onSubmit={handleUpdateProperty}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Property Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={editingProperty.name || ''}
                    onChange={(e) => setEditingProperty({ ...editingProperty, name: e.target.value })}
                    className="w-full bg-white dark:bg-[#1b1b1b] border border-gray-300 dark:border-[#3b3b3b] rounded p-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0078d4] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    value={editingProperty.address}
                    onChange={(e) => setEditingProperty({ ...editingProperty, address: e.target.value })}
                    required
                    className="w-full bg-white dark:bg-[#1b1b1b] border border-gray-300 dark:border-[#3b3b3b] rounded p-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0078d4] focus:border-transparent"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditingProperty(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#1b1b1b] border border-gray-300 dark:border-[#3b3b3b] rounded hover:bg-gray-50 dark:hover:bg-[#292929] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-[#0078d4] hover:bg-[#106ebe] rounded transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}