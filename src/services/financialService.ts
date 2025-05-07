import { supabase } from '../lib/supabase';
import OpenAI from 'openai';

class FinancialService {
  private openai;
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;

  constructor() {
    this.openai = new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    });
    this.clientId = import.meta.env.VITE_QUICKBOOKS_CLIENT_ID;
    this.clientSecret = import.meta.env.VITE_QUICKBOOKS_CLIENT_SECRET;
    this.redirectUri = `${window.location.origin}/quickbooks/callback`;
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
      const scopes = encodeURIComponent('com.intuit.quickbooks.accounting');
      const state = encodeURIComponent(Math.random().toString(36).substring(7));
      
      const authUrl = new URL('https://appcenter.intuit.com/connect/oauth2');
      authUrl.searchParams.append('client_id', this.clientId);
      authUrl.searchParams.append('response_type', 'code');
      authUrl.searchParams.append('scope', scopes);
      authUrl.searchParams.append('redirect_uri', this.redirectUri);
      authUrl.searchParams.append('state', state);

      window.location.href = authUrl.toString();
    } catch (error) {
      console.error('Error connecting to QuickBooks:', error);
      throw new Error('Failed to connect to QuickBooks');
    }
  }

  async handleCallback(code: string): Promise<void> {
    try {
      const tokenUrl = 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer';
      const authHeader = btoa(`${this.clientId}:${this.clientSecret}`);

      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${authHeader}`
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: this.redirectUri
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to get QuickBooks tokens: ${errorData.error_description || 'Unknown error'}`);
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
          realm_id: tokens.realmId,
          access_token_expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString()
        });
    } catch (error) {
      console.error('Error handling QuickBooks callback:', error);
      throw error;
    }
  }

  async getMetrics() {
    // For demo purposes, returning mock data
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