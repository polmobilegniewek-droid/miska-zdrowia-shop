import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const kategoria = url.searchParams.get('kategoria');
    const sku = url.searchParams.get('sku');
    
    // Fetch the XML file
    const xmlUrl = `${Deno.env.get('SUPABASE_URL')?.replace('/rest/v1', '')}/storage/v1/object/public/products/products.xml`;
    console.log('Fetching XML from:', xmlUrl);
    
    const xmlResponse = await fetch(xmlUrl);
    if (!xmlResponse.ok) {
      throw new Error(`Failed to fetch XML: ${xmlResponse.statusText}`);
    }
    
    const xmlText = await xmlResponse.text();
    
    // Parse XML using DOMParser
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    
    if (!xmlDoc) {
      throw new Error('Failed to parse XML');
    }
    
    const products = xmlDoc.querySelectorAll('product');
    const productList = [];
    
    for (const productNode of products) {
      const product = productNode as Element;
      const code = product.querySelector('code')?.textContent?.trim() || '';
      const name = product.querySelector('name')?.textContent?.trim() || '';
      const description = product.querySelector('description')?.textContent?.trim() || '';
      const price = product.querySelector('price_netto')?.textContent?.trim() || '0';
      const producer = product.querySelector('producer')?.textContent?.trim() || '';
      
      // Get image URL
      const images = product.querySelector('images');
      let imageUrl = '';
      if (images) {
        const largeImage = images.querySelector('large');
        if (largeImage) {
          imageUrl = largeImage.textContent?.trim() || '';
        }
      }
      
      // Get categories
      const categoriesNode = product.querySelector('categories');
      const categories = [];
      if (categoriesNode) {
        const categoryNodes = categoriesNode.querySelectorAll('category');
        for (const cat of categoryNodes) {
          const catText = cat.textContent?.trim();
          if (catText) {
            categories.push(catText);
          }
        }
      }
      
      // Get stock
      const stockNode = product.querySelector('stock');
      const stock = stockNode?.textContent?.trim() || '0';
      
      // Filter by SKU if provided
      if (sku && code !== sku) {
        continue;
      }
      
      // Filter by category if provided
      if (kategoria) {
        const categoryMatch = categories.some(cat => {
          const catLower = cat.toLowerCase();
          const searchLower = kategoria.toLowerCase();
          
          // Match category structure
          if (searchLower === 'dla-psa') {
            return catLower.startsWith('psy');
          } else if (searchLower === 'dla-kota') {
            return catLower.startsWith('koty');
          } else if (searchLower.includes('dla-psa/')) {
            const subcat = searchLower.replace('dla-psa/', '');
            if (subcat === 'dorosly') {
              return catLower.includes('psy dorosłe');
            } else if (subcat === 'szczeniak') {
              return catLower.includes('szczenią');
            } else if (subcat === 'senior') {
              return catLower.includes('senior');
            }
          } else if (searchLower.includes('dla-kota/')) {
            const subcat = searchLower.replace('dla-kota/', '');
            if (subcat === 'dorosly') {
              return catLower.includes('koty dorosłe');
            } else if (subcat === 'kociak') {
              return catLower.includes('kociąt') || catLower.includes('kocią');
            } else if (subcat === 'senior') {
              return catLower.includes('senior');
            }
          }
          return false;
        });
        
        if (!categoryMatch) {
          continue;
        }
      }
      
      productList.push({
        sku: code,
        nazwa: name,
        opis: description,
        cena_netto: price,
        stan_magazynowy: stock,
        url_zdjecia: imageUrl,
        producent: producer,
        kategorie: categories
      });
    }
    
    // If single product requested, return object instead of array
    if (sku && productList.length > 0) {
      return new Response(JSON.stringify(productList[0]), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    return new Response(JSON.stringify(productList), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('Error in get-products function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ 
      error: errorMessage,
      details: 'Failed to process products'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
