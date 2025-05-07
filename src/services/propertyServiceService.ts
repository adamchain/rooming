import { supabase } from '../lib/supabase';

interface Service {
  id: string;
  property_id: string;
  name: string;
  description: string;
  price: string;
  website_url: string;
  created_at: string;
  updated_at: string;
}

class PropertyServiceService {
  async getServices(propertyId: string): Promise<Service[]> {
    try {
      const { data, error } = await supabase
        .from('property_services')
        .select('*')
        .eq('property_id', propertyId)
        .order('name');

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching property services:', error);
      throw new Error('Failed to fetch property services');
    }
  }

  async addService(service: Omit<Service, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const { data, error } = await supabase
        .from('property_services')
        .insert([service])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding property service:', error);
      throw new Error('Failed to add property service');
    }
  }

  async updateService(id: string, service: Partial<Omit<Service, 'id' | 'created_at' | 'updated_at'>>) {
    try {
      const { data, error } = await supabase
        .from('property_services')
        .update(service)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating property service:', error);
      throw new Error('Failed to update property service');
    }
  }

  async deleteService(id: string) {
    try {
      const { error } = await supabase
        .from('property_services')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting property service:', error);
      throw new Error('Failed to delete property service');
    }
  }
}

export default new PropertyServiceService();