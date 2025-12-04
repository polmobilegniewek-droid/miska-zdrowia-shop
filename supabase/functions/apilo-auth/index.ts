import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { clientId, clientSecret, authCode, apiUrl } = await req.json();

    console.log('[apilo-auth] Received request for token generation');
    console.log(`[apilo-auth] API URL: ${apiUrl}`);
    console.log(`[apilo-auth] Client ID: ${clientId}`);

    if (!clientId || !clientSecret || !authCode || !apiUrl) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters: clientId, clientSecret, authCode, apiUrl' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Basic Auth header
    const basicAuth = btoa(`${clientId}:${clientSecret}`);
    
    // Apilo token endpoint
    const tokenUrl = `${apiUrl}/rest/auth/token/`;
    
    console.log(`[apilo-auth] Requesting token from: ${tokenUrl}`);

    // Try with JSON body first (Apilo may prefer this)
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        code: authCode,
      }),
    });

    const responseText = await response.text();
    console.log(`[apilo-auth] Response status: ${response.status}`);
    console.log(`[apilo-auth] Response body: ${responseText}`);

    if (!response.ok) {
      return new Response(
        JSON.stringify({ 
          error: `Apilo API error: ${response.status}`, 
          details: responseText,
          status: response.status 
        }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Try to parse as JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      data = { raw: responseText };
    }

    console.log('[apilo-auth] Token generated successfully');

    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[apilo-auth] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
