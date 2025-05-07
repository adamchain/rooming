import { createClient } from '@supabase/supabase-js';

class DocumentService {
  private supabase;

  constructor() {
    this.supabase = createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY
    );
  }

  async getDocuments() {
    try {
      const { data, error } = await this.supabase
        .from('documents')
        .select(`
          *,
          property:properties(id, name, address),
          document_qa_history(
            id,
            question,
            answer,
            created_at
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching documents:', error);
      throw new Error('Failed to fetch documents');
    }
  }

  async addDocument(document: {
    name: string;
    content: string;
    analysis: string;
    property_id?: string;
    document_type?: string;
  }) {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Sanitize content by removing null characters and other problematic Unicode sequences
      const sanitizedContent = document.content.replace(/\u0000/g, '');

      const { data, error } = await this.supabase
        .from('documents')
        .insert([{
          ...document,
          content: sanitizedContent,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding document:', error);
      throw new Error('Failed to add document');
    }
  }

  async addQAHistory(documentId: string, question: string, answer: string) {
    try {
      const { data, error } = await this.supabase
        .from('document_qa_history')
        .insert([{
          document_id: documentId,
          question,
          answer
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding QA history:', error);
      throw new Error('Failed to add QA history');
    }
  }

  async deleteDocument(id: string) {
    try {
      const { error } = await this.supabase
        .from('documents')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting document:', error);
      throw new Error('Failed to delete document');
    }
  }
}

export default new DocumentService();