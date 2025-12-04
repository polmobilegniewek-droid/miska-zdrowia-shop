import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// HARDCODED CREDENTIALS
const APILO_API_URL = "https://miskazdrowia.apilo.com";
const CLIENT_ID = "1";
const CLIENT_SECRET = "abc4f0b2-1b0e-5cf2-958b-0d5260625596";
const AUTH_CODE = "9006ebb2-282c-5827-9672-b7a35692f044";

// Cache for access token
let cachedToken: string | null = null;
let tokenExpiry: number = 0;

async function getAccessToken(): Promise<string> {
  // Return cached token if still valid
  if (cachedToken && Date.now() < tokenExpiry) {
    console.log('[apilo-proxy] Using cached token');
    return cachedToken;
  }

  console.log('[apilo-proxy] Getting new access token via OAuth...');
  
  // Try OAuth token endpoint
  const tokenUrl = `${APILO_API_URL}/oauth/token`;
  
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    code: AUTH_CODE,
  });

  console.log(`[apilo-proxy] Token request to: ${tokenUrl}`);

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  const responseText = await response.text();
  console.log(`[apilo-proxy] Token response status: ${response.status}`);
  console.log(`[apilo-proxy] Token response: ${responseText}`);

  if (!response.ok) {
    throw new Error(`OAuth error: ${response.status} - ${responseText}`);
  }

  const data = JSON.parse(responseText);
  cachedToken = data.access_token;
  
  // Set expiry (default 21 days if not provided, minus 1 hour buffer)
  const expiresIn = data.expires_in || (21 * 24 * 60 * 60);
  tokenExpiry = Date.now() + (expiresIn - 3600) * 1000;
  
  console.log(`[apilo-proxy] Got access token, expires in ${expiresIn}s`);
  return cachedToken!;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body (POST method)
    let limit = 100;
    let page = 1;
    let sku: string | null = null;

    if (req.method === 'POST') {
      try {
        const body = await req.json();
        limit = body.limit || 100;
        page = body.page || 1;
        sku = body.sku || null;
        console.log(`[apilo-proxy] Received body:`, JSON.stringify(body));
      } catch (e) {
        console.log(`[apilo-proxy] No JSON body or parse error`);
      }
    }

    // Get access token
    const accessToken = await getAccessToken();

    // Build Apilo API URL
    let apiloEndpoint = `${APILO_API_URL}/rest/api/products?limit=${limit}&page=${page}`;
    
    // If SKU is provided, add filter
    if (sku) {
      apiloEndpoint += `&filter[sku]=${encodeURIComponent(sku)}`;
    }

    console.log(`[apilo-proxy] Fetching from: ${apiloEndpoint}`);

    const response = await fetch(apiloEndpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[apilo-proxy] Apilo API error: ${response.status} - ${errorText}`);
      
      // If 401, clear cached token and retry once
      if (response.status === 401 && cachedToken) {
        console.log('[apilo-proxy] Token expired, clearing cache...');
        cachedToken = null;
        tokenExpiry = 0;
      }
      
      return new Response(
        JSON.stringify({ error: `Apilo API error: ${response.status}`, details: errorText }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log(`[apilo-proxy] Received ${data.products?.length || 0} products from Apilo`);
    console.log(`[apilo-proxy] Raw response keys:`, Object.keys(data));

    // Map Apilo products to our format
    const mappedProducts = (data.products || []).map((product: any) => ({
      sku: product.id?.toString() || product.sku || '',
      nazwa: product.name || product.title || '',
      opis: product.description || null,
      cena_netto: product.price?.toString() || product.priceNet?.toString() || '0',
      stan_magazynowy: product.stock?.toString() || product.quantity?.toString() || '0',
      url_zdjecia: product.images?.[0]?.url || product.mainImage || product.image || null,
      kategorie_xml: product.categories?.map((c: any) => c.name || c).join(' || ') || '',
    }));

    return new Response(
      JSON.stringify({ products: mappedProducts, total: data.total || mappedProducts.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[apilo-proxy] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
