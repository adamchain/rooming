import { supabase } from '../lib/supabase';

interface Activity {
  id: string;
  tenant_id: string;
  type: 'payment' | 'maintenance' | 'document' | 'message';
  title: string;
  description: string;
  status?: string;
  amount?: number;
  created_at: string;
  metadata?: Record<string, any>;
}

class TenantActivityService {
  async getActivities(tenantId: string): Promise<Activity[]> {
    try {
      const { data, error } = await supabase
        .from('tenant_activities')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching tenant activities:', error);
      throw new Error('Failed to fetch tenant activities');
    }
  }
}

export default new TenantActivityService();