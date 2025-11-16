import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper function to extract text from XML tags
function extractTag(xml: string, tag: string): string | null {
  const pattern = new RegExp(`<${tag}><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>|<${tag}>([^<]*)<\\/${tag}>`, 'i');
  const match = xml.match(pattern);
  return match ? (match[1] || match[2] || '').trim() : null;
}

// Helper function to extract all category tags
function extractCategories(xml: string): string[] {
  const categoriesMatch = xml.match(/<categories>([\s\S]*?)<\/categories>/i);
  if (!categoriesMatch) return [];
  
  const categoriesXml = categoriesMatch[1];
  const categoryMatches = categoriesXml.matchAll(/<category><!\\[CDATA\\[(.*?)\\]\\]><\/category>/g);
  
  const categories: string[] = [];
  for (const match of categoryMatches) {
    if (match[1]) {
      categories.push(match[1].trim());
    }
  }
  return categories;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const kategoria = url.searchParams.get('kategoria');
    const sku = url.searchParams.get('sku');
    
    console.log('Request params:', { kategoria, sku });
    
    // Fetch the XML file from the public directory
    const origin = url.origin.replace('https://', 'https://id-preview--');
    const xmlUrl = `${origin}/products.xml`;
    console.log('Fetching XML from:', xmlUrl);
    
    const xmlResponse = await fetch(xmlUrl);
    if (!xmlResponse.ok) {
      console.error('Failed to fetch XML:', xmlResponse.statusText);
      throw new Error(`Failed to fetch XML: ${xmlResponse.statusText}`);
    }
    
    const xmlText = await xmlResponse.text();
    console.log('XML fetched, length:', xmlText.length);
    
    // Split by products
    const productMatches = xmlText.matchAll(/<product>([\s\S]*?)<\/product>/g);
    const productList = [];
    
    for (const match of productMatches) {
      const productXml = match[1];
      
      const code = extractTag(productXml, 'code') || '';
      const name = extractTag(productXml, 'name') || '';
      const description = extractTag(productXml, 'description') || '';
      const price = extractTag(productXml, 'price_netto') || '0';
      const producer = extractTag(productXml, 'producer') || '';
      
      // Get image URL
      const imagesMatch = productXml.match(/<images>([\s\S]*?)<\/images>/i);
      let imageUrl = '';
      if (imagesMatch) {
        const largeImage = extractTag(imagesMatch[1], 'large');
        if (largeImage) {
          imageUrl = largeImage;
        }
      }
      
      // Get categories
      const categories = extractCategories(productXml);
      
      // Get stock
      const stock = extractTag(productXml, 'stock') || '0';
      
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
              return catLower.includes('psy dorosłe') || catLower.includes('psy / sucha karma / karma wg. wieku / psy dorosłe');
            } else if (subcat === 'szczeniak') {
              return catLower.includes('szczenią');
            } else if (subcat === 'senior') {
              return catLower.includes('senior');
            }
          } else if (searchLower.includes('dla-kota/')) {
            const subcat = searchLower.replace('dla-kota/', '');
            if (subcat === 'dorosly') {
              return catLower.includes('koty dorosłe') || catLower.includes('koty / sucha karma / karma wg. wieku / koty dorosłe');
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
    
    console.log(`Found ${productList.length} products`);
    
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
