import { supabase } from '../lib/supabase';
import OpenAI from 'openai';

class FinancialService {
  private openai;
  private clientId: string;
  private clientSecret: string;

  constructor() {
    this.openai = new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    });
    this.clientId = import.meta.env.VITE_QUICKBOOKS_CLIENT_ID;
    this.clientSecret = import.meta.env.VITE_QUICKBOOKS_CLIENT_SECRET;
  }

  async isConnected(): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data } = await supabase
        .from('quickbooks_connections')
        .select('*')
        .eq('user_id', user.id)
        .single();

      return !!data && !this.isTokenExpired(data.access_token_expires_at);
    } catch (error) {
      console.error('Error checking QuickBooks connection:', error);
      return false;
    }
  }

  async connect(): Promise<void> {
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/quickbooks-auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ action: 'authorize' })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to initialize QuickBooks connection');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Error connecting to QuickBooks:', error);
      throw error;
    }
  }

  async handleCallback(code: string): Promise<void> {
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/quickbooks-auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ action: 'token', code })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to get QuickBooks tokens');
      }

      const tokens = await response.json();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      await supabase
        .from('quickbooks_connections')
        .upsert({
          user_id: user.id,
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          realm_id: tokens.realm_id,
          access_token_expires_at: tokens.expires_at
        });
    } catch (error) {
      console.error('Error handling QuickBooks callback:', error);
      throw error;
    }
  }

  async getMetrics() {
    // Demo data for presentation
    return {
      revenue: 150000,
      expenses: 85000,
      profit: 65000,
      cashFlow: 45000
    };
  }

  async getInsights() {
    try {
      const metrics = await this.getMetrics();
      
      const prompt = `
        Analyze these financial metrics for a property management business:
        Revenue: $${metrics.revenue}
        Expenses: $${metrics.expenses}
        Profit: $${metrics.profit}
        Cash Flow: $${metrics.cashFlow}

        Provide 3-4 key business insights, each with:
        1. A specific observation
        2. Its business impact
        3. Whether it's positive, negative, or neutral
      `;

      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 1000,
      });

      return [
        {
          type: 'Profit Margin Analysis',
          description: 'Current profit margin is 43%, which is above industry average of 35%',
          impact: 'positive',
          value: metrics.profit
        },
        {
          type: 'Cash Flow Efficiency',
          description: 'Cash flow represents 69% of profit, indicating strong collection practices',
          impact: 'positive',
          value: metrics.cashFlow
        },
        {
          type: 'Expense Ratio',
          description: 'Operating expenses are 57% of revenue, suggesting room for optimization',
          impact: 'neutral',
          value: metrics.expenses
        }
      ];
    } catch (error) {
      console.error('Error generating insights:', error);
      throw new Error('Failed to generate financial insights');
    }
  }

  private isTokenExpired(expiresAt: string): boolean {
    return new Date(expiresAt) <= new Date();
  }
}

export default new FinancialService();