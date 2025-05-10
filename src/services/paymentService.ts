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
      const response = await fetch(`${GETTRX_API_URL}/payment-requests`, {
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
      const response = await fetch(`${GETTRX_API_URL}/payment-requests`, {
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
}

export default new PaymentService();