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

// Access token generated on 2024-12-04, expires 2025-12-25
const ACCESS_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3NjQ4NjIyOTgsImlzcyI6Im1pc2themRyb3dpYS5hcGlsby5jb20iLCJleHAiOjE3NjY2NzY2OTgsImp0aSI6ImE3NjczODhhLTY0N2EtNTQ4ZC05MjZiLTMzMTEzNjNkNzlmMyIsInR5cGUiOiJhY2Nlc3NfdG9rZW4iLCJjbGllbnRfaWQiOjEsInBsYXRmb3JtX2lkIjo0fQ.rOY_R-F5MHPcN7eRGPysGMIIB56-wC3wIzOEDMj2jnRG6tSkUrtUtOIBVfzAoIkpyqd-O2mbnVVqFi-MnldA-3Qr8JHBSXYDWJej6Ycy5F1yNYtNs3u0nEMGNYWHJQJkeZhDk9Eggd4zN5rE1D-y3iT1fr4AsZPTUIxKNEwrmRqUpKnI94FOq5hlcPjkM2DBifFzeSKLsnXUjEY3qOepuJxj3jkRfh9mvhko_K2mlMsqE3G_-3kyD8gv1fuy0V25K5HdxD2GDsl4O1hMMlBAPJurt3ahK6sh4Dw5znPn6I5cO52aT6hNhF8PrGN1mzC3aVGGeTMRWm-U-l1uIv50U1gBCQjynvmNeX_XMoa5dqKy_K4ZyGCXbshIOYCrfl5lwcpfZEBAnBW6EIp1iSPcqwffFrLpMA0wDeT3OB8cAxvu_0U7rjyT0JnQlc9h0AV5UTuPZK6Aw_B4LCDn9mIrH5cAwLObOVSutV6hVFp1meEtZ9n_e4srwe097ZlT5J6arD6-mhHo0m-mbWqf2n3Nf61PLFdt1Ay6iAsz0yW21q221dkhY3PRQR4AgTGUJa-g0uFBKKJkNaRoIya_PKAB2u0AlE5wa9v05tQNX1ehR-SE2zPf2LwQk8TzCDWen4q9yZSa7pLinaBI4GrGbZS3GfL3lpYuz6v1YOEUPYqJhOw";

// Refresh token for when access token expires
const REFRESH_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3NjQ4NjIyOTgsImlzcyI6Im1pc2themRyb3dpYS5hcGlsby5jb20iLCJleHAiOjE3NzAyMTkwOTgsImp0aSI6IjQ1MDRjYmZhLWE0MzItNTBlNS05NzA3LTM0OTliZTg5YjM5MSIsInR5cGUiOiJyZWZyZXNoX3Rva2VuIiwiY2xpZW50X2lkIjoxLCJwbGF0Zm9ybV9pZCI6NH0.ukQxQLHDsS-8zwFy0kl8bsgX26xRBkjvk4BNBpW_ormHAfon4eyMJ1WhWRRf0SOfcOsNymL3dPPXsLfjECjpuVmHssPsFwekx_K_STLhM926t8phCVH_x4VxUFmNU9p0iqTPtlhBj_ECvVyNiFKYUjruujDpBsXENTrwJsG40IUujRbxkEQlFVMsqFNM_BPOdN0AibgIq90l-Yp1Uip1IYcv1kEkgy4w2ZKFcTmVYV6JQbCHsw4kTddDqALkWk1GQAcVfQnPt4qXvmqo_jCPUw1qHTf4mLTO_ZDGLKWiXL_mxBqzZJzFwNZNXVt79RrXjICF70VQHIjQo3Rl_JKqoVfkmSB_t1kaeSHE4msQ1JAzdwngzvCDEUao3qTLZcVe4nNDWH5UDUYDeLIeZZ7ksDieLR8ieZ_j1K-VyvOrKV9nzetplg2EkNZbAJReoG6mVdPeqj8GFdadjlmT8pv_bZrI_Br_bCWew3K_dmpQc2Oq2Q8MPWMb4oaypDDRROZHPAARuJD7wR4bgNsDF2xZ84A1Lc_JHAWdj_aWN3h5u7Cch1sruBfQCqDaeohuBbNnfrLVVOgupPq9qf9ZatlTTTnePsEcgfWH5-QQ-6qdWh5vCiGZ2enQFLh2Xs-UFvMr9gLlMWT4jobvFhaDsIXwWX4OlAeq0x3Ff1ckuALhZjk";

// Token cache
let currentAccessToken = ACCESS_TOKEN;

async function refreshAccessToken(): Promise<string> {
  console.log('[apilo-proxy] Refreshing access token...');
  
  const tokenUrl = `${APILO_API_URL}/rest/auth/token/`;
  const basicAuth = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${basicAuth}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      grantType: 'refresh_token',
      token: REFRESH_TOKEN,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[apilo-proxy] Token refresh failed: ${response.status} - ${errorText}`);
    throw new Error(`Token refresh failed: ${response.status}`);
  }

  const data = await response.json();
  currentAccessToken = data.accessToken;
  console.log('[apilo-proxy] Access token refreshed successfully');
  return currentAccessToken;
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

    // Build Apilo API URL - correct endpoint: /rest/api/warehouse/product/ (with trailing slash!)
    // Query params: id, sku, name, ean, status (0=inactive, 1=active, 8=archive), offset, limit
    let apiloEndpoint = `${APILO_API_URL}/rest/api/warehouse/product/?limit=${limit}&offset=${(page - 1) * limit}`;
    
    // If SKU is provided, add filter
    if (sku) {
      apiloEndpoint += `&sku=${encodeURIComponent(sku)}`;
    }

    console.log(`[apilo-proxy] Fetching from: ${apiloEndpoint}`);

    let response = await fetch(apiloEndpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${currentAccessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // If 401, try to refresh token and retry
    if (response.status === 401) {
      console.log('[apilo-proxy] Token expired, refreshing...');
      try {
        await refreshAccessToken();
        response = await fetch(apiloEndpoint, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${currentAccessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });
      } catch (refreshError) {
        console.error('[apilo-proxy] Token refresh failed:', refreshError);
      }
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[apilo-proxy] Apilo API error: ${response.status} - ${errorText}`);
      return new Response(
        JSON.stringify({ error: `Apilo API error: ${response.status}`, details: errorText }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log(`[apilo-proxy] Received ${data.products?.length || 0} products from Apilo`);
    console.log(`[apilo-proxy] totalCount:`, data.totalCount);
    console.log(`[apilo-proxy] Full raw response:`, JSON.stringify(data).substring(0, 2000));

    // Map Apilo products to our format
    // API returns: name, unit, weight, priceWithoutTax, sku, ean, id, originalCode, quantity, priceWithTax, tax, status
    const mappedProducts = (data.products || []).map((product: any) => ({
      sku: product.sku || product.id?.toString() || '',
      nazwa: product.name || '',
      opis: product.description || null,
      cena_netto: product.priceWithoutTax?.toString() || '0',
      cena_brutto: product.priceWithTax?.toString() || '0',
      stan_magazynowy: product.quantity?.toString() || '0',
      url_zdjecia: product.images?.[0]?.url || product.mainImage || product.image || null,
      kategorie_xml: product.categories?.map((c: any) => c.name || c).join(' || ') || '',
      ean: product.ean || '',
      vat: product.tax || '23',
    }));

    return new Response(
      JSON.stringify({ 
        products: mappedProducts, 
        total: data.total || data.totalCount || mappedProducts.length,
        debug_raw: data 
      }),
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
