import { createClient } from '@supabase/supabase-js';

const GETTRX_API_URL = 'https://api-dev.gettrx.com';

class MerchantService {
  private supabase;

  constructor() {
    this.supabase = createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY
    );
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
      // Create merchant account with GETTRX
      const response = await fetch(`${GETTRX_API_URL}/merchants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
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
        throw new Error('Failed to create merchant account');
      }

      const { merchantId, publicKey, secretKey } = await response.json();

      // Store merchant account info in Supabase
      const { data: merchantAccount, error } = await this.supabase
        .from('merchant_accounts')
        .insert([{
          merchant_id: merchantId,
          public_key: publicKey,
          secret_key: secretKey,
          status: 'active'
        }])
        .select()
        .single();

      if (error) throw error;
      return merchantAccount;
    } catch (error) {
      console.error('Error creating merchant account:', error);
      throw error;
    }
  }

  async getMerchantAccount() {
    try {
      const { data, error } = await this.supabase
        .from('merchant_accounts')
        .select('*')
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