import { createClient } from '@supabase/supabase-js';

interface Contact {
  id: string;
  user_id: string;
  category_id: string;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  category?: {
    id: string;
    name: string;
    description?: string;
  };
}

class ContactService {
  private supabase;

  constructor() {
    this.supabase = createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY
    );
  }

  async getContacts() {
    try {
      const { data, error } = await this.supabase
        .from('contacts')
        .select(`
          *,
          category:contact_categories(id, name, description)
        `)
        .order('name');

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching contacts:', error);
      throw new Error('Failed to fetch contacts');
    }
  }

  async getCategories() {
    try {
      const { data, error } = await this.supabase
        .from('contact_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching contact categories:', error);
      throw new Error('Failed to fetch contact categories');
    }
  }

  async addContact(contact: Omit<Contact, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await this.supabase
        .from('contacts')
        .insert([{
          ...contact,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding contact:', error);
      throw new Error('Failed to add contact');
    }
  }

  async updateContact(id: string, contact: Partial<Omit<Contact, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) {
    try {
      const { data, error } = await this.supabase
        .from('contacts')
        .update(contact)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating contact:', error);
      throw new Error('Failed to update contact');
    }
  }

  async deleteContact(id: string) {
    try {
      const { error } = await this.supabase
        .from('contacts')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting contact:', error);
      throw new Error('Failed to delete contact');
    }
  }
}

export default new ContactService();