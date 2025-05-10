import { createClient } from '@supabase/supabase-js';

const GETTRX_API_URL = 'https://api-sandbox.gettrx.com/v1';
const GETTRX_SECRET_KEY = 'sk_gDOd9rcdoq89j8iIatmQ7nPy8L4G3ebZ9Q4sZH4tiswkVHDorvdQ-SP3IpjN-lMw';
const GETTRX_MERCHANT_ID = 'acm_67c1039bd94d3f0001ee9801';

class MerchantService {
  private supabase;

  constructor() {
    this.supabase = createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY
    );
  }

  async signInMerchant(email: string, password: string) {
    try {
      const response = await fetch(`${GETTRX_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to sign in to merchant account');
      }

      const { merchantId, accessToken } = await response.json();

      // Store merchant credentials in Supabase
      const { data: { user } } = await this.supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      await this.supabase
        .from('merchant_accounts')
        .upsert({
          user_id: user.id,
          merchant_id: merchantId,
          public_key: accessToken,
          secret_key: GETTRX_SECRET_KEY,
          status: 'active'
        });

      return { merchantId, accessToken };
    } catch (error) {
      console.error('Error signing in to merchant account:', error);
      throw error;
    }
  }

  async createMerchantAccount(data: {
    businessName: string;
    email: string;
    phone: string;
    address: {
      line1: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
    bankAccount: {
      accountNumber: string;
      routingNumber: string;
      accountType: 'checking' | 'savings';
    };
  }) {
    try {
      const response = await fetch(`${GETTRX_API_URL}/merchants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GETTRX_SECRET_KEY}`
        },
        body: JSON.stringify({
          business: {
            name: data.businessName,
            email: data.email,
            phone: data.phone,
            address: data.address
          },
          bankAccount: data.bankAccount
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create merchant account');
      }

      const { merchantId, publicKey } = await response.json();

      // Store merchant account info in Supabase
      const { data: { user } } = await this.supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await this.supabase
        .from('merchant_accounts')
        .insert([{
          user_id: user.id,
          merchant_id: merchantId,
          public_key: publicKey,
          secret_key: GETTRX_SECRET_KEY,
          status: 'active'
        }]);

      if (error) throw error;
      return { merchantId, publicKey };
    } catch (error) {
      console.error('Error creating merchant account:', error);
      throw error;
    }
  }

  async getMerchantAccount() {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await this.supabase
        .from('merchant_accounts')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching merchant account:', error);
      throw error;
    }
  }
}

export default new MerchantService();