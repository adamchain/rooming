// Follow Deno and Supabase Edge Function conventions
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Twilio } from "npm:twilio@4.22.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    const { phone, message } = await req.json();

    // Validate input parameters
    if (!phone || !message) {
      return new Response(
        JSON.stringify({ 
          error: 'Phone number and message are required',
          code: 'INVALID_PARAMETERS'
        }),
        {
          status: 400,
          headers: corsHeaders
        }
      );
    }

    // Validate environment variables
    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const phoneNumber = Deno.env.get('TWILIO_PHONE_NUMBER');

    if (!accountSid || !authToken || !phoneNumber) {
      console.error('Missing Twilio configuration');
      return new Response(
        JSON.stringify({ 
          error: 'Missing Twilio configuration',
          code: 'CONFIGURATION_ERROR'
        }),
        {
          status: 500,
          headers: corsHeaders
        }
      );
    }

    // Initialize Twilio client
    let client;
    try {
      client = new Twilio(accountSid, authToken);
    } catch (error) {
      console.error('Twilio client initialization error:', error);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to initialize Twilio client',
          code: 'TWILIO_INIT_ERROR'
        }),
        {
          status: 500,
          headers: corsHeaders
        }
      );
    }

    try {
      const twilioResponse = await client.messages.create({
        body: message,
        to: phone,
        from: phoneNumber,
      });

      return new Response(
        JSON.stringify({ 
          success: true, 
          messageId: twilioResponse.sid 
        }),
        { 
          status: 200,
          headers: corsHeaders 
        }
      );
    } catch (twilioError) {
      console.error('Twilio API error:', twilioError);
      
      return new Response(
        JSON.stringify({ 
          error: twilioError.message || 'Failed to send SMS',
          code: twilioError.code || 'TWILIO_API_ERROR'
        }),
        {
          status: 400,
          headers: corsHeaders
        }
      );
    }
  } catch (error) {
    console.error('General error in send-sms function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        code: 'INTERNAL_ERROR'
      }),
      {
        status: 500,
        headers: corsHeaders
      }
    );
  }
});