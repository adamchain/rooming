import React, { useState, useEffect } from 'react';
import { Plus, Trash2, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { formatCurrency } from '../utils/formatters';

interface Roommate {
  id: string;
  name: string;
  email: string;
  share_percentage: number;
  status: 'pending' | 'active';
}

interface RoommateManagerProps {
  tenantId: string;
  rentAmount: number;
  onSplitPayment: (roommates: Roommate[]) => void;
}

export default function RoommateManager({ tenantId, rentAmount, onSplitPayment }: RoommateManagerProps) {
  const [roommates, setRoommates] = useState<Roommate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRoommate, setNewRoommate] = useState({
    name: '',
    email: '',
    share_percentage: 0
  });

  useEffect(() => {
    loadRoommates();
  }, [tenantId]);

  const loadRoommates = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('roommates')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('created_at');

      if (fetchError) {
        console.error('Error fetching roommates:', fetchError);
        throw new Error(fetchError.message || 'Failed to load roommates');
      }
      
      setRoommates(data || []);
    } catch (err) {
      console.error('Error loading roommates:', err);
      setError(err instanceof Error ? err.message : 'Failed to load roommates');
    } finally {
      setLoading(false);
    }
  };

  const handleAddRoommate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // Validate total percentage doesn't exceed 100%
      const totalPercentage = roommates.reduce((sum, r) => sum + r.share_percentage, 0) + newRoommate.share_percentage;
      if (totalPercentage > 100) {
        throw new Error('Total share percentage cannot exceed 100%');
      }

      const { data, error: insertError } = await supabase
        .from('roommates')
        .insert([{
          tenant_id: tenantId,
          name: newRoommate.name,
          email: newRoommate.email,
          share_percentage: newRoommate.share_percentage,
          status: 'pending'
        }])
        .select()
        .single();

      if (insertError) {
        console.error('Supabase error adding roommate:', insertError);
        throw new Error(insertError.message || 'Failed to add roommate');
      }

      if (!data) {
        throw new Error('No data returned from roommate insertion');
      }

      setRoommates([...roommates, data]);
      setShowAddForm(false);
      setNewRoommate({ name: '', email: '', share_percentage: 0 });
    } catch (err) {
      console.error('Error adding roommate:', err);
      setError(err instanceof Error ? err.message : 'Failed to add roommate');
    }
  };

  const handleRemoveRoommate = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('roommates')
        .delete()
        .eq('id', id);

      if (deleteError) {
        console.error('Supabase error removing roommate:', deleteError);
        throw new Error(deleteError.message || 'Failed to remove roommate');
      }

      setRoommates(roommates.filter(r => r.id !== id));
    } catch (err) {
      console.error('Error removing roommate:', err);
      setError(err instanceof Error ? err.message : 'Failed to remove roommate');
    }
  };

  const calculateShare = (percentage: number): number => {
    return (rentAmount * percentage) / 100;
  };

  if (loading) {
    return <div>Loading roommates...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Roommates</h3>
        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-[#0078d4] hover:bg-[#106ebe] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0078d4]"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Roommate
        </button>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-300">{error}</h3>
            </div>
          </div>
        </div>
      )}

      {showAddForm && (
        <form onSubmit={handleAddRoommate} className="bg-white dark:bg-[#252525] p-4 rounded-lg border border-gray-200 dark:border-[#3b3b3b]">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Name
              </label>
              <input
                type="text"
                value={newRoommate.name}
                onChange={(e) => setNewRoommate({ ...newRoommate, name: e.target.value })}
                required
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-[#0078d4] focus:ring-[#0078d4] sm:text-sm dark:bg-[#1b1b1b] dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                type="email"
                value={newRoommate.email}
                onChange={(e) => setNewRoommate({ ...newRoommate, email: e.target.value })}
                required
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-[#0078d4] focus:ring-[#0078d4] sm:text-sm dark:bg-[#1b1b1b] dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Share Percentage
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="number"
                  value={newRoommate.share_percentage || ''}
                  onChange={(e) => setNewRoommate({ ...newRoommate, share_percentage: parseFloat(e.target.value) || 0 })}
                  min="1"
                  max="100"
                  required
                  className="block w-full rounded-md border-gray-300 dark:border-gray-600 pr-12 focus:border-[#0078d4] focus:ring-[#0078d4] sm:text-sm dark:bg-[#1b1b1b] dark:text-white"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 dark:text-gray-400 sm:text-sm">%</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#1b1b1b] border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-[#292929] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0078d4]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-[#0078d4] hover:bg-[#106ebe] rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0078d4]"
            >
              Add Roommate
            </button>
          </div>
        </form>
      )}

      {roommates.length > 0 ? (
        <div className="bg-white dark:bg-[#252525] rounded-lg border border-gray-200 dark:border-[#3b3b3b] overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-[#3b3b3b]">
            <thead className="bg-gray-50 dark:bg-[#1b1b1b]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Share
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-[#252525] divide-y divide-gray-200 dark:divide-[#3b3b3b]">
              {roommates.map((roommate) => (
                <tr key={roommate.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {roommate.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {roommate.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {roommate.share_percentage}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatCurrency(calculateShare(roommate.share_percentage))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      roommate.status === 'active'
                        ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300'
                        : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300'
                    }`}>
                      {roommate.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleRemoveRoommate(roommate.id)}
                      className="text-red-600 dark:text-red-500 hover:text-red-900 dark:hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-6 bg-white dark:bg-[#252525] rounded-lg border border-gray-200 dark:border-[#3b3b3b]">
          <p className="text-gray-500 dark:text-gray-400">No roommates added yet</p>
        </div>
      )}

      {roommates.length > 0 && (
        <div className="flex justify-end">
          <button
            onClick={() => onSplitPayment(roommates)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#0078d4] hover:bg-[#106ebe] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0078d4]"
          >
            Split Payment
          </button>
        </div>
      )}
    </div>
  );
}