import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, previousReading, currentReading } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Calculate water bill if readings provided
    let billInfo = '';
    if (previousReading !== undefined && currentReading !== undefined) {
      const unitsUsed = currentReading - previousReading;
      const totalCost = unitsUsed * 200; // 200 shillings per unit
      billInfo = `\n\nCurrent calculation: Previous reading: ${previousReading} units, Current reading: ${currentReading} units, Units used: ${unitsUsed} units, Total bill: ${totalCost} shillings (@ 200 shillings/unit)`;
    }

    const systemPrompt = `You are a water conservation and safety advisor for SDG 6 (Clean Water & Sanitation). Your role is to:

1. **Water Bill Predictions**: When users provide previous and current meter readings, calculate their bill at 200 shillings per unit and explain the calculation clearly.

2. **Conservation Advice**: Provide practical, actionable tips to reduce water consumption and avoid shortages. Include:
   - Daily habits to save water (shorter showers, fixing leaks, turning off taps)
   - Efficient appliance usage (dishwashers, washing machines)
   - Rainwater harvesting and greywater reuse where applicable
   - Seasonal considerations for water saving

3. **Water Safety**: Advise on:
   - Safe water treatment methods (boiling, chlorination, filtration)
   - Proper storage practices to prevent contamination
   - Signs of unsafe water (turbidity, odor, color)
   - pH levels and water quality parameters
   - Health risks from contaminated water

Keep responses clear, concise, and culturally appropriate. Use metric measurements (liters) and provide specific numbers when possible. Be encouraging and supportive of conservation efforts.
${billInfo}`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        stream: false,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limits exceeded, please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required, please add funds to your Lovable AI workspace.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: 'AI gateway error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in water-advisor-chat:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
