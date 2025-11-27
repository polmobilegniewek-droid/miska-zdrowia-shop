import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const XML_URL = 'https://www.hurtowniakarm.pl/oferta-produktow-pelna.xml?user=yHj93go4kHOJbTSv1ELRBNoRG7S%2BLm81lZqFUH6c6Vs%3D';

interface Product {
  id: string;
  sku: string;
  nazwa: string;
  opis: string | null;
  producent: string;
  kategorie: string[];
  cena_netto: string;
  cena_domyslna: string;
  stan_magazynowy: string;
  url_zdjecia: string | null;
  wszystkie_zdjecia: string[];
  waga: string;
  jednostka: string;
  ean: string | null;
  aktywny: boolean;
}

function parseXMLProducts(xmlText: string): Product[] {
  const products: Product[] = [];
  
  try {
    // Simple regex-based XML parsing for better compatibility
    const productMatches = Array.from(xmlText.matchAll(/<product>([\s\S]*?)<\/product>/g));
    
    console.log(`Found ${productMatches.length} product nodes`);
    
    for (const productMatch of productMatches) {
      const productXml = productMatch[1];

      try {
        // Helper function to extract text from XML tags
        const getTagContent = (tag: string): string | null => {
          const match = productXml.match(new RegExp(`<${tag}[^>]*>(.*?)<\/${tag}>`, 's'));
          return match ? match[1].trim() : null;
        };

        const id = getTagContent("id") || "";
        const code = getTagContent("code") || "";
        const name = getTagContent("name") || "";
        const description = getTagContent("description");
        const producer = getTagContent("producer") || "";
        const active = getTagContent("active") === "1";
        
        // Categories - extract all categories
        const categories: string[] = [];
        const categoryMatches = Array.from(productXml.matchAll(/<category[^>]*>(.*?)<\/category>/g));
        for (const catMatch of categoryMatches) {
          const catText = catMatch[1].trim();
          if (catText) categories.push(catText);
        }

        // Prices
        const priceNetto = getTagContent("price_netto") || "0";
        const defaultPriceNetto = getTagContent("default_price_netto") || "0";
        
        // Stock
        const quantity = getTagContent("quantity") || "0";
        
        // Images
        const images: string[] = [];
        const imageMatches = Array.from(productXml.matchAll(/<img[^>]*>[\s\S]*?<url[^>]*>(.*?)<\/url>[\s\S]*?<\/img>/g));
        for (const imgMatch of imageMatches) {
          const url = imgMatch[1].trim();
          if (url) images.push(url);
        }

        // Other details
        const weight = getTagContent("weight") || "0";
        const unit = getTagContent("unit") || "sztuka";
        
        // EAN
        const eanMatch = productXml.match(/<attribute[^>]*type="1"[^>]*>[\s\S]*?<value[^>]*>(.*?)<\/value>[\s\S]*?<\/attribute>/);
        const ean = eanMatch ? eanMatch[1].trim() : null;

        // Only add products that have at least basic data
        if (id && code && name) {
          products.push({
            id,
            sku: code,
            nazwa: name,
            opis: description,
            producent: producer,
            kategorie: categories,
            cena_netto: priceNetto,
            cena_domyslna: defaultPriceNetto,
            stan_magazynowy: quantity,
            url_zdjecia: images[0] || null,
            wszystkie_zdjecia: images,
            waga: weight,
            jednostka: unit,
            ean,
            aktywny: active
          });
        }
      } catch (error) {
        console.error("Error parsing individual product:", error);
      }
    }
  } catch (error) {
    console.error("Error in parseXMLProducts:", error);
  }

  return products;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const kategoria = url.searchParams.get('kategoria');
    const sku = url.searchParams.get('sku');

    console.log('Fetching XML from hurtownia...');
    const response = await fetch(XML_URL);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch XML: ${response.statusText}`);
    }

    const xmlText = await response.text();
    console.log('XML fetched, parsing products...');
    
    let products = parseXMLProducts(xmlText);
    console.log(`Parsed ${products.length} products`);

    // Filter by SKU if requested
    if (sku) {
      const product = products.find(p => p.sku === sku);
      return new Response(
        JSON.stringify(product || null),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Filter by category if requested
    if (kategoria) {
      const categoryPath = decodeURIComponent(kategoria);
      console.log(`Filtering by category: ${categoryPath}`);
      
      products = products.filter(product => {
        return product.kategorie.some(cat => {
          const normalizedCat = cat.toLowerCase().replace(/\s+/g, '-');
          return normalizedCat.includes(categoryPath.toLowerCase().replace(/\//g, '-'));
        });
      });
      
      console.log(`Filtered to ${products.length} products`);
    }

    return new Response(
      JSON.stringify(products),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in fetch-products function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
