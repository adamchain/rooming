import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import IntuitOAuth from "npm:intuit-oauth@4.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, code } = await req.json();
    const origin = req.headers.get('origin') || '';
    const redirectUri = `${origin}/dashboard/financials/quickbooks/callback`;

    const oauthClient = new IntuitOAuth({
      clientId: Deno.env.get('QUICKBOOKS_CLIENT_ID')!,
      clientSecret: Deno.env.get('QUICKBOOKS_CLIENT_SECRET')!,
      environment: 'sandbox',
      redirectUri,
    });

    if (action === 'authorize') {
      const authUri = oauthClient.authorizeUri({
        scope: [
          'com.intuit.quickbooks.accounting',
          'com.intuit.quickbooks.payment',
        ],
        state: crypto.randomUUID(), // More secure state handling
      });

      return new Response(
        JSON.stringify({ url: authUri }),
        { headers: corsHeaders }
      );
    }

    if (action === 'token' && code) {
      const token = await oauthClient.createToken(code);
      
      return new Response(
        JSON.stringify({
          access_token: token.access_token,
          refresh_token: token.refresh_token,
          realm_id: token.realmId,
          expires_at: new Date(Date.now() + token.expires_in * 1000).toISOString()
        }),
        { headers: corsHeaders }
      );
    }

    throw new Error('Invalid action');
  } catch (error) {
    console.error('QuickBooks OAuth error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        code: error.code || 'QUICKBOOKS_AUTH_ERROR'
      }),
      { 
        status: error.status || 500, 
        headers: corsHeaders 
      }
    );
  }
});