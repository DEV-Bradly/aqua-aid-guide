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
    
    const GEMINI_API_KEY = Deno.env.get('AIzaSyBxWUWN7w632C4QlJfiqH5EKH_6SecOmKQ');
    if (!GEMINI_API_KEY) {
      throw new Error('Gemini API key is not configured');
    }

    // Calculate water bill if readings provided
    let billInfo = '';
    if (previousReading !== undefined && currentReading !== undefined) {
      const unitsUsed = currentReading - previousReading;
      const totalCost = unitsUsed * 200; // 200 shillings per unit
      billInfo = `\n\nCurrent calculation: Previous reading: ${previousReading} units, Current reading: ${currentReading} units, Units used: ${unitsUsed} units, Total bill: ${totalCost} shillings (@ 200 shillings/unit)`;
    }

    const systemPrompt = `You are an expert SDG 6 (Clean Water and Sanitation) advisor with comprehensive knowledge and capabilities to address any water-related issues. Your expertise covers:

**CORE SDG 6 TARGETS:**
1. Universal access to safe and affordable drinking water
2. Access to adequate and equitable sanitation and hygiene
3. Improve water quality by reducing pollution
4. Increase water-use efficiency across all sectors
5. Implement integrated water resources management
6. Protect and restore water-related ecosystems

**WATER CONSERVATION & EFFICIENCY:**
- Advanced water-saving techniques for homes, businesses, and agriculture
- Leak detection and repair strategies
- Efficient irrigation systems and rainwater harvesting
- Greywater recycling and water reuse systems
- Smart water meters and monitoring technologies
- Drought preparedness and water storage solutions

**WATER QUALITY & SAFETY:**
- Water treatment methods (boiling, filtration, chlorination, UV treatment)
- Water quality testing and parameters (pH, TDS, bacteria, chemicals)
- Contamination sources and prevention strategies
- Safe water storage and distribution
- Emergency water purification techniques
- Health impacts of unsafe water and disease prevention

**SANITATION & HYGIENE:**
- Proper sanitation facilities and wastewater management
- Hygiene best practices and handwashing importance
- Septic systems and sewage treatment
- Preventing waterborne diseases
- Community sanitation programs

**WATER BILL CALCULATIONS:**
- Calculate bills based on meter readings (200 shillings per unit)
- Provide cost-saving recommendations
- Analyze consumption patterns and suggest improvements
${billInfo}

**ENVIRONMENTAL & SUSTAINABILITY:**
- Water pollution control and remediation
- Protecting watersheds, rivers, lakes, and aquifers
- Climate change impacts on water resources
- Sustainable water management practices
- Water conservation in agriculture and industry

**PROBLEM-SOLVING:**
You can address ANY water-related issue including:
- Water scarcity and shortage solutions
- Flooding and drainage problems
- Water infrastructure challenges
- Policy and governance questions
- Community water projects
- Emergency water supply situations

Provide detailed, practical, and actionable advice. Be comprehensive and thorough in your responses. Give specific examples, step-by-step guidance, and relevant data when applicable. Your goal is to empower users with knowledge and solutions for all SDG 6 related challenges.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: systemPrompt },
              { text: messages[messages.length - 1].content }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Gemini response:', JSON.stringify(data));
    
    // Convert Gemini response format to OpenAI-compatible format
    const geminiText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.';
    
    const formattedResponse = {
      choices: [
        {
          message: {
            role: 'assistant',
            content: geminiText
          }
        }
      ]
    };

    return new Response(JSON.stringify(formattedResponse), {
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
