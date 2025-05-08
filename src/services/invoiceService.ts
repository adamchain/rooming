import { createClient } from '@supabase/supabase-js';
import { nanoid } from 'nanoid';
import { addDays } from 'date-fns';

interface InvoiceItem {
  description: string;
  amount: number;
}

interface Invoice {
  id: string;
  tenant_id?: string;
  contact_id?: string;
  property_id?: string;
  items: InvoiceItem[];
  total: number;
  due_date: string;
  status: 'pending' | 'paid' | 'overdue';
  payment_link: string;
  created_at: string;
}

class InvoiceService {
  private supabase;

  constructor() {
    this.supabase = createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY
    );
  }

  async createInvoice(data: {
    tenant_id: string;
    property_id: string;
    items: InvoiceItem[];
    due_date?: string;
  }): Promise<Invoice> {
    try {
      const total = data.items.reduce((sum, item) => sum + item.amount, 0);
      const paymentId = nanoid(10);
      const dueDate = data.due_date || addDays(new Date(), 30).toISOString().split('T')[0];

      const { data: invoice, error } = await this.supabase
        .from('invoices')
        .insert([{
          tenant_id: data.tenant_id,
          property_id: data.property_id,
          items: data.items,
          total,
          due_date: dueDate,
          status: 'pending',
          payment_link: `/pay/${paymentId}`
        }])
        .select(`
          *,
          tenant:tenants(name, email),
          property:properties(name, address)
        `)
        .single();

      if (error) throw error;
      return invoice;
    } catch (error) {
      console.error('Error creating invoice:', error);
      throw new Error('Failed to create invoice');
    }
  }

  async createContactInvoice(data: {
    contact_id: string;
    items: InvoiceItem[];
    due_date?: string;
  }): Promise<Invoice> {
    try {
      const total = data.items.reduce((sum, item) => sum + item.amount, 0);
      const paymentId = nanoid(10);
      const dueDate = data.due_date || addDays(new Date(), 30).toISOString().split('T')[0];

      const { data: invoice, error } = await this.supabase
        .from('invoices')
        .insert([{
          contact_id: data.contact_id,
          items: data.items,
          total,
          due_date: dueDate,
          status: 'pending',
          payment_link: `/pay/${paymentId}`
        }])
        .select(`
          *,
          contact:contacts(name, email, company),
          property:properties(name, address)
        `)
        .single();

      if (error) throw error;
      return invoice;
    } catch (error) {
      console.error('Error creating contact invoice:', error);
      throw new Error('Failed to create contact invoice');
    }
  }

  async getInvoices() {
    try {
      const { data, error } = await this.supabase
        .from('invoices')
        .select(`
          *,
          tenant:tenants(name, email),
          contact:contacts(name, email, company),
          property:properties(name, address)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching invoices:', error);
      throw new Error('Failed to fetch invoices');
    }
  }

  async getInvoiceByPaymentId(paymentId: string) {
    try {
      const { data, error } = await this.supabase
        .from('invoices')
        .select(`
          *,
          tenant:tenants(name, email),
          contact:contacts(name, email, company),
          property:properties(name, address)
        `)
        .eq('payment_link', `/pay/${paymentId}`)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching invoice:', error);
      throw new Error('Failed to fetch invoice');
    }
  }

  async updateInvoiceStatus(id: string, status: 'pending' | 'paid' | 'overdue') {
    try {
      const { data, error } = await this.supabase
        .from('invoices')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating invoice status:', error);
      throw new Error('Failed to update invoice status');
    }
  }
}

export default new InvoiceService();