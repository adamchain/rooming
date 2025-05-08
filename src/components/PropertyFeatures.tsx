import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import propertyFeatureService from '../services/propertyFeatureService';

interface PropertyFeaturesProps {
  propertyId: string;
}

interface Feature {
  id: string;
  name: string;
  category: string;
  description?: string;
  feature_categories?: {
    name: string;
    description?: string;
  };
}

interface Category {
  id: string;
  name: string;
  description?: string;
}

export default function PropertyFeatures({ propertyId }: PropertyFeaturesProps) {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [editingFeature, setEditingFeature] = useState<string | null>(null);
  const [newFeature, setNewFeature] = useState({
    name: '',
    category: '',
    description: ''
  });

  useEffect(() => {
    loadFeatures();
    loadCategories();
  }, [propertyId]);

  const loadFeatures = async () => {
    try {
      const data = await propertyFeatureService.getPropertyFeatures(propertyId);
      setFeatures(data);
    } catch (err) {
      setError('Failed to load property features');
      console.error(err);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await propertyFeatureService.getFeatureCategories();
      setCategories(data);
    } catch (err) {
      setError('Failed to load feature categories');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFeature = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await propertyFeatureService.addFeature(propertyId, newFeature);
      setNewFeature({ name: '', category: '', description: '' });
      loadFeatures();
    } catch (err) {
      setError('Failed to add feature');
      console.error(err);
    }
  };

  const handleUpdateFeature = async (id: string, feature: Partial<Feature>) => {
    try {
      await propertyFeatureService.updateFeature(id, feature);
      setEditingFeature(null);
      loadFeatures();
    } catch (err) {
      setError('Failed to update feature');
      console.error(err);
    }
  };

  const handleDeleteFeature = async (id: string) => {
    try {
      await propertyFeatureService.deleteFeature(id);
      loadFeatures();
    } catch (err) {
      setError('Failed to delete feature');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center p-4">Loading...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Property Features</h2>
        <button
          onClick={() => setEditingFeature('new')}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Feature
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
          {error}
        </div>
      )}

      {editingFeature === 'new' && (
        <form onSubmit={handleAddFeature} className="mb-6 p-4 border rounded-md">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Feature Name
              </label>
              <input
                type="text"
                value={newFeature.name}
                onChange={(e) => setNewFeature({ ...newFeature, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                value={newFeature.category}
                onChange={(e) => setNewFeature({ ...newFeature, category: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={newFeature.description}
                onChange={(e) => setNewFeature({ ...newFeature, description: e.target.value })}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setEditingFeature(null)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Add Feature
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <div
            key={feature.id}
            className="relative bg-gray-50 rounded-lg p-4 hover:bg-gray-100"
          >
            {editingFeature === feature.id ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={feature.name}
                  onChange={(e) => setFeatures(features.map(f =>
                    f.id === feature.id ? { ...f, name: e.target.value } : f
                  ))}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                <select
                  value={feature.category}
                  onChange={(e) => setFeatures(features.map(f =>
                    f.id === feature.id ? { ...f, category: e.target.value } : f
                  ))}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <div className="flex justify-end space-x-2 mt-2">
                  <button
                    onClick={() => setEditingFeature(null)}
                    className="inline-flex items-center p-1 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleUpdateFeature(feature.id, feature)}
                    className="inline-flex items-center p-1 border border-transparent rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    <Save className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {feature.name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {feature.feature_categories?.name}
                    </p>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => setEditingFeature(feature.id)}
                      className="p-1 text-gray-400 hover:text-gray-500"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteFeature(feature.id)}
                      className="p-1 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                {feature.description && (
                  <p className="mt-1 text-sm text-gray-500">
                    {feature.description}
                  </p>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}