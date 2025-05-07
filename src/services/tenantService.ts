import { createClient } from '@supabase/supabase-js';

class TenantService {
  private supabase;

  constructor() {
    this.supabase = createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY
    );
  }

  async getTenants() {
    try {
      const { data, error } = await this.supabase
        .from('tenants')
        .select(`
          *,
          property:properties(id, name, address)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching tenants:', error);
      throw new Error('Failed to fetch tenants');
    }
  }

  async addTenant(tenant: {
    property_id: string;
    name: string;
    email: string;
    phone?: string;
    lease_start: string;
    lease_end: string;
    rent_amount: number;
    security_deposit: number;
    notes?: string;
  }) {
    try {
      const { data, error } = await this.supabase
        .from('tenants')
        .insert([tenant])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding tenant:', error);
      throw new Error('Failed to add tenant');
    }
  }

  async updateTenant(id: string, tenant: Partial<{
    property_id: string;
    name: string;
    email: string;
    phone: string;
    lease_start: string;
    lease_end: string;
    rent_amount: number;
    security_deposit: number;
    notes: string;
  }>) {
    try {
      const { data, error } = await this.supabase
        .from('tenants')
        .update(tenant)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating tenant:', error);
      throw new Error('Failed to update tenant');
    }
  }

  async deleteTenant(id: string) {
    try {
      const { error } = await this.supabase
        .from('tenants')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting tenant:', error);
      throw new Error('Failed to delete tenant');
    }
  }
}

export default new TenantService();