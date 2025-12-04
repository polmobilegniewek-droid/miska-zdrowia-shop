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

    // Normalize URL - remove trailing slash
    const baseUrl = apiUrl.replace(/\/+$/, '');
    
    // Create Basic Auth header (clientId:clientSecret)
    const basicAuth = btoa(`${clientId}:${clientSecret}`);
    
    // Apilo token endpoint
    const tokenUrl = `${baseUrl}/rest/auth/token/`;
    
    console.log(`[apilo-auth] Requesting token from: ${tokenUrl}`);

    // Apilo expects JSON body with camelCase keys:
    // grantType: "authorization_code"
    // token: "{authorization_code}"
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        grantType: 'authorization_code',
        token: authCode,
      }),
    });

    const responseText = await response.text();
    console.log(`[apilo-auth] Response status: ${response.status}`);
    console.log(`[apilo-auth] Response body: ${responseText}`);

    // Return raw response regardless of status for debugging
    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      data = { raw: responseText };
    }

    return new Response(
      JSON.stringify({ 
        success: response.ok, 
        status: response.status,
        data 
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
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
