import { createClient } from '@supabase/supabase-js';
import { nanoid } from 'nanoid';
import { addDays } from 'date-fns';

interface Contributor {
  name: string;
  email: string;
  amount: number;
}

class SplitPaymentService {
  private supabase;

  constructor() {
    this.supabase = createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY
    );
  }

  async createSplitPayment(invoiceId: string, amount: number, contributors: Contributor[]) {
    try {
      // Create the split payment record
      const { data: splitPayment, error: splitError } = await this.supabase
        .from('payment_splits')
        .insert([{
          invoice_id: invoiceId,
          amount,
          contributors: JSON.stringify(contributors),
          status: 'pending',
          expires_at: addDays(new Date(), 7).toISOString()
        }])
        .select()
        .single();

      if (splitError) throw splitError;

      // Create contribution records for each contributor
      const contributions = contributors.map(contributor => ({
        split_id: splitPayment.id,
        name: contributor.name,
        email: contributor.email,
        amount: contributor.amount,
        status: 'pending',
        payment_link: `/pay/${nanoid(10)}`
      }));

      const { error: contribError } = await this.supabase
        .from('split_contributions')
        .insert(contributions);

      if (contribError) throw contribError;

      return splitPayment;
    } catch (error) {
      console.error('Error creating split payment:', error);
      throw error;
    }
  }

  async getSplitPayment(splitId: string) {
    try {
      const { data, error } = await this.supabase
        .from('payment_splits')
        .select(`
          *,
          contributions:split_contributions(*)
        `)
        .eq('id', splitId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching split payment:', error);
      throw error;
    }
  }

  async updateContributionStatus(contributionId: string, status: 'pending' | 'paid') {
    try {
      const { error } = await this.supabase
        .from('split_contributions')
        .update({ status })
        .eq('id', contributionId);

      if (error) throw error;

      // Check if all contributions are paid
      const { data: split } = await this.supabase
        .from('split_contributions')
        .select('split_id, status')
        .eq('split_id', contributionId);

      if (split && split.every(c => c.status === 'paid')) {
        // Update split payment status to completed
        await this.supabase
          .from('payment_splits')
          .update({ status: 'completed' })
          .eq('id', split[0].split_id);
      }
    } catch (error) {
      console.error('Error updating contribution status:', error);
      throw error;
    }
  }
}

export default new SplitPaymentService();