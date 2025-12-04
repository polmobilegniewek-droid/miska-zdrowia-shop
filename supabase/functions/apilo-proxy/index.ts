import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
    const APILO_API_URL = Deno.env.get('APILO_API_URL');
    const APILO_ACCESS_TOKEN = Deno.env.get('APILO_ACCESS_TOKEN');

    if (!APILO_API_URL || !APILO_ACCESS_TOKEN) {
      console.error('Missing APILO_API_URL or APILO_ACCESS_TOKEN');
      return new Response(
        JSON.stringify({ error: 'Missing API configuration' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body or URL params
    const url = new URL(req.url);
    const limit = url.searchParams.get('limit') || '100';
    const page = url.searchParams.get('page') || '1';
    const sku = url.searchParams.get('sku');

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
        'Authorization': `Bearer ${APILO_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

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
