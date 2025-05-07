import { createClient } from '@supabase/supabase-js';

class MaintenanceService {
  private supabase;

  constructor() {
    this.supabase = createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY
    );
  }

  async getMaintenanceRequests() {
    try {
      const { data, error } = await this.supabase
        .from('maintenance_requests')
        .select(`
          *,
          property:properties(id, name, address),
          tenant:tenants(id, name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching maintenance requests:', error);
      throw new Error('Failed to fetch maintenance requests');
    }
  }

  async addMaintenanceRequest(request: {
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
  }) {
    try {
      const { data, error } = await this.supabase
        .from('maintenance_requests')
        .insert([request])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding maintenance request:', error);
      throw new Error('Failed to add maintenance request');
    }
  }

  async updateMaintenanceRequest(id: string, request: Partial<{
    property_id: string;
    tenant_id: string;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
    estimated_cost: number;
    actual_cost: number;
    scheduled_date: string;
    completed_date: string;
    notes: string;
  }>) {
    try {
      const { data, error } = await this.supabase
        .from('maintenance_requests')
        .update(request)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating maintenance request:', error);
      throw new Error('Failed to update maintenance request');
    }
  }

  async deleteMaintenanceRequest(id: string) {
    try {
      const { error } = await this.supabase
        .from('maintenance_requests')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting maintenance request:', error);
      throw new Error('Failed to delete maintenance request');
    }
  }
}

export default new MaintenanceService();