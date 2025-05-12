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
  const [showAddForm, setShowAddForm] = useState(false);
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

  const handleAddFeature = async () => {
    try {
      await propertyFeatureService.addFeature(propertyId, newFeature);
      setNewFeature({ name: '', category: '', description: '' });
      setShowAddForm(false);
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-medium text-gray-900 dark:text-white">Features</h3>
        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-[#0078d4] hover:text-[#106ebe] border border-[#0078d4] hover:bg-[#0078d4] hover:text-white rounded transition-colors"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Feature
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white dark:bg-[#252525] rounded-lg border border-gray-200 dark:border-[#3b3b3b] p-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Feature Name
              </label>
              <input
                type="text"
                value={newFeature.name}
                onChange={(e) => setNewFeature({ ...newFeature, name: e.target.value })}
                className="w-full bg-white dark:bg-[#1b1b1b] border border-gray-300 dark:border-[#3b3b3b] rounded p-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0078d4] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select
                value={newFeature.category}
                onChange={(e) => setNewFeature({ ...newFeature, category: e.target.value })}
                className="w-full bg-white dark:bg-[#1b1b1b] border border-gray-300 dark:border-[#3b3b3b] rounded p-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0078d4] focus:border-transparent"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={newFeature.description}
                onChange={(e) => setNewFeature({ ...newFeature, description: e.target.value })}
                className="w-full bg-white dark:bg-[#1b1b1b] border border-gray-300 dark:border-[#3b3b3b] rounded p-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0078d4] focus:border-transparent"
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#292929] rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddFeature}
                className="px-3 py-1.5 text-sm font-medium text-white bg-[#0078d4] hover:bg-[#106ebe] rounded transition-colors"
              >
                Add Feature
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {features.map((feature) => (
          <div
            key={feature.id}
            className="bg-white dark:bg-[#252525] rounded-lg border border-gray-200 dark:border-[#3b3b3b] p-4 hover:border-[#0078d4] dark:hover:border-[#0078d4] transition-colors"
          >
            {editingFeature === feature.id ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={feature.name}
                  onChange={(e) => setFeatures(features.map(f =>
                    f.id === feature.id ? { ...f, name: e.target.value } : f
                  ))}
                  className="w-full bg-white dark:bg-[#1b1b1b] border border-gray-300 dark:border-[#3b3b3b] rounded p-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0078d4] focus:border-transparent"
                />
                <select
                  value={feature.category}
                  onChange={(e) => setFeatures(features.map(f =>
                    f.id === feature.id ? { ...f, category: e.target.value } : f
                  ))}
                  className="w-full bg-white dark:bg-[#1b1b1b] border border-gray-300 dark:border-[#3b3b3b] rounded p-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0078d4] focus:border-transparent"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setEditingFeature(null)}
                    className="p-1 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleUpdateFeature(feature.id, feature)}
                    className="p-1 text-[#0078d4] hover:text-[#106ebe]"
                  >
                    <Save className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      {feature.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {feature.feature_categories?.name}
                    </p>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => setEditingFeature(feature.id)}
                      className="p-1 text-gray-400 hover:text-[#0078d4] dark:text-gray-500 dark:hover:text-[#0078d4]"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteFeature(feature.id)}
                      className="p-1 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                {feature.description && (
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
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