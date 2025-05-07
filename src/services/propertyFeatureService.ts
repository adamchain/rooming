import { createClient } from '@supabase/supabase-js';

class PropertyFeatureService {
  private supabase;

  constructor() {
    this.supabase = createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY
    );
  }

  async getFeatureCategories() {
    try {
      const { data, error } = await this.supabase
        .from('feature_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching feature categories:', error);
      throw new Error('Failed to fetch feature categories');
    }
  }

  async getPropertyFeatures(propertyId: string) {
    try {
      const { data, error } = await this.supabase
        .from('property_features')
        .select(`
          *,
          feature_categories (
            name,
            description
          )
        `)
        .eq('property_id', propertyId)
        .order('name');

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching property features:', error);
      throw new Error('Failed to fetch property features');
    }
  }

  async addFeature(propertyId: string, feature: {
    name: string;
    category: string;
    description?: string;
  }) {
    try {
      const { data, error } = await this.supabase
        .from('property_features')
        .insert([{
          property_id: propertyId,
          name: feature.name,
          category: feature.category,
          description: feature.description
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding property feature:', error);
      throw new Error('Failed to add property feature');
    }
  }

  async updateFeature(featureId: string, feature: {
    name?: string;
    category?: string;
    description?: string;
  }) {
    try {
      const { data, error } = await this.supabase
        .from('property_features')
        .update(feature)
        .eq('id', featureId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating property feature:', error);
      throw new Error('Failed to update property feature');
    }
  }

  async deleteFeature(featureId: string) {
    try {
      const { error } = await this.supabase
        .from('property_features')
        .delete()
        .eq('id', featureId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting property feature:', error);
      throw new Error('Failed to delete property feature');
    }
  }
}

export default new PropertyFeatureService();