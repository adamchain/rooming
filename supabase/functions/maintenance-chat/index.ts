import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import OpenAI from "npm:openai@4.28.4";

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
    const { messages, requestDetails } = await req.json();

    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY')!,
    });

    // Create system prompt with maintenance expertise
    const systemPrompt = `You are an expert property maintenance advisor. Your role is to:
1. Diagnose maintenance issues based on descriptions
2. Assess severity (low, medium, high, critical)
3. Recommend whether DIY fixes are appropriate
4. Suggest professional help when needed
5. Provide safety warnings when applicable

Current maintenance request details:
${JSON.stringify(requestDetails, null, 2)}`;

    // Get AI diagnosis
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const response = completion.choices[0]?.message?.content;

    // Analyze if professional help is needed
    const needsContractor = response?.toLowerCase().includes('professional') || 
                          response?.toLowerCase().includes('contractor') ||
                          response?.toLowerCase().includes('expert');

    return new Response(
      JSON.stringify({ 
        response,
        needsContractor 
      }),
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
});