import { createClient } from '@supabase/supabase-js';

const GETTRX_API_URL = 'https://api-sandbox.gettrx.com/v1';
const GETTRX_SECRET_KEY = 'sk_gDOd9rcdoq89j8iIatmQ7nPy8L4G3ebZ9Q4sZH4tiswkVHDorvdQ-SP3IpjN-lMw';
const GETTRX_MERCHANT_ID = 'acm_67c1039bd94d3f0001ee9801';

class PaymentService {
  private supabase;

  constructor() {
    this.supabase = createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY
    );
  }

  async createCustomer(name: string) {
    try {
      const response = await fetch(`${GETTRX_API_URL}/customers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GETTRX_SECRET_KEY}`,
          'X-Merchant-ID': GETTRX_MERCHANT_ID
        },
        body: JSON.stringify({ name })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create customer');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  }

  async createPayment(amount: number, paymentToken: string, setupFutureUsage = false) {
    try {
      const response = await fetch(`${GETTRX_API_URL}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GETTRX_SECRET_KEY}`,
          'X-Merchant-ID': GETTRX_MERCHANT_ID
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Convert to cents
          currency: 'usd',
          setupFutureUsage: setupFutureUsage ? 'off_session' : undefined,
          paymentToken
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create payment');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  }

  async createRecurringPayment(amount: number, paymentMethodId: string, customerId: string) {
    try {
      const response = await fetch(`${GETTRX_API_URL}/recurring-payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GETTRX_SECRET_KEY}`,
          'X-Merchant-ID': GETTRX_MERCHANT_ID
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Convert to cents
          currency: 'usd',
          setupFutureUsage: 'off_session',
          paymentMethodId,
          customer: customerId
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create recurring payment');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating recurring payment:', error);
      throw error;
    }
  }

  async createSplitPayment(invoiceId: string, amount: number, contributors: Array<{
    name: string;
    email: string;
    amount: number;
  }>) {
    try {
      // Create split payment record in Supabase
      const { data: splitPayment, error: splitError } = await this.supabase
        .from('payment_splits')
        .insert([{
          invoice_id: invoiceId,
          amount,
          contributors: JSON.stringify(contributors),
          status: 'pending',
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
        }])
        .select()
        .single();

      if (splitError) throw splitError;

      // Create individual payment links for each contributor
      const contributionPromises = contributors.map(async (contributor) => {
        const paymentLink = await this.createPaymentLink(contributor.amount);
        
        return this.supabase
          .from('split_contributions')
          .insert([{
            split_id: splitPayment.id,
            name: contributor.name,
            email: contributor.email,
            amount: contributor.amount,
            status: 'pending',
            payment_link: paymentLink
          }]);
      });

      await Promise.all(contributionPromises);

      return splitPayment;
    } catch (error) {
      console.error('Error creating split payment:', error);
      throw error;
    }
  }

  private async createPaymentLink(amount: number): Promise<string> {
    try {
      const response = await fetch(`${GETTRX_API_URL}/payment-links`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GETTRX_SECRET_KEY}`,
          'X-Merchant-ID': GETTRX_MERCHANT_ID
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100),
          currency: 'usd',
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create payment link');
      }

      const { url } = await response.json();
      return url;
    } catch (error) {
      console.error('Error creating payment link:', error);
      throw error;
    }
  }
}

export default new PaymentService();