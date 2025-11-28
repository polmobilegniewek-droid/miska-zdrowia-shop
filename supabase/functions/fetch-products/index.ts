import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const XML_URL = 'https://www.hurtowniakarm.pl/oferta-produktow-pelna.xml?user=yHj93go4kHOJbTSv1ELRBNoRG7S%2BLm81lZqFUH6c6Vs%3D';
const XML_STANY_URL = 'https://www.hurtowniakarm.pl/oferta-produktow-stany.xml?user=yHj93go4kHOJbTSv1ELRBNoRG7S%2BLm81lZqFUH6c6Vs%3D';

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
  min_order?: string;
}

function parseXMLProducts(xmlText: string): Product[] {
  const products: Product[] = [];
  
  // Helper function to remove CDATA wrapper and clean XML tags
  const cleanCDATA = (text: string | null): string | null => {
    if (!text) return text;
    // Remove CDATA wrapper
    let cleaned = text.replace(/<!\[CDATA\[(.*?)\]\]>/gs, '$1');
    // Remove any remaining XML tags like <value>
    cleaned = cleaned.replace(/<[^>]+>/g, '');
    return cleaned.trim();
  };
  
  try {
    // Simple regex-based XML parsing for better compatibility
    const productMatches = Array.from(xmlText.matchAll(/<product>([\s\S]*?)<\/product>/g));
    
    console.log(`Found ${productMatches.length} product nodes`);
    
    for (const productMatch of productMatches) {
      const productXml = productMatch[1];

      try {
        // Helper function to extract text from XML tags and clean CDATA
        const getTagContent = (tag: string): string | null => {
          const match = productXml.match(new RegExp(`<${tag}[^>]*>(.*?)<\/${tag}>`, 's'));
          return match ? cleanCDATA(match[1].trim()) : null;
        };

        const id = getTagContent("id") || "";
        const code = getTagContent("code") || "";
        const name = getTagContent("name") || "";
        const description = getTagContent("description");
        const producer = getTagContent("producer") || "";
        const active = getTagContent("active") === "1";
        
        // Categories - extract all categories and clean CDATA
        const categories: string[] = [];
        const categoryMatches = Array.from(productXml.matchAll(/<category[^>]*>(.*?)<\/category>/g));
        for (const catMatch of categoryMatches) {
          const catText = cleanCDATA(catMatch[1].trim());
          if (catText) categories.push(catText);
        }

        // Prices
        const priceNetto = getTagContent("price_netto") || "0";
        const defaultPriceNetto = getTagContent("default_price_netto") || "0";
        
        // Stock
        const quantity = getTagContent("quantity") || "0";
        
        // Images - extract from images section
        const images: string[] = [];
        
        // Look for all image URLs in the images section: <images><img><url>
        const imagesMatch = productXml.match(/<images[^>]*>([\s\S]*?)<\/images>/);
        if (imagesMatch) {
          const imagesContent = imagesMatch[1];
          // Extract all URLs from <img><url> tags
          const urlMatches = Array.from(imagesContent.matchAll(/<img[^>]*>[\s\S]*?<url[^>]*>([\s\S]*?)<\/url>[\s\S]*?<\/img>/g));
          for (const urlMatch of urlMatches) {
            const url = cleanCDATA(urlMatch[1]);
            if (url && url.startsWith('http')) {
              images.push(url);
            }
          }
        }

        // Other details
        const weight = getTagContent("weight") || "0";
        const unit = getTagContent("unit") || "sztuka";
        
        // EAN - clean CDATA from value tag
        const eanMatch = productXml.match(/<attribute[^>]*type="1"[^>]*>[\s\S]*?<value[^>]*>(.*?)<\/value>[\s\S]*?<\/attribute>/);
        const ean = eanMatch ? cleanCDATA(eanMatch[1].trim()) : null;

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

// Parse stock and price XML
function parseStockXML(xmlText: string): Map<string, { quantity: string; price_netto: string; active: boolean; min_order: string }> {
  const stockMap = new Map();
  
  // Helper function to remove CDATA wrapper
  const cleanCDATA = (text: string | null): string | null => {
    if (!text) return text;
    return text.replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').trim();
  };
  
  try {
    const productMatches = Array.from(xmlText.matchAll(/<product>([\s\S]*?)<\/product>/g));
    
    console.log(`Found ${productMatches.length} stock entries`);
    
    for (const productMatch of productMatches) {
      const productXml = productMatch[1];
      
      try {
        const getTagContent = (tag: string): string | null => {
          const match = productXml.match(new RegExp(`<${tag}[^>]*>(.*?)<\/${tag}>`, 's'));
          return match ? cleanCDATA(match[1].trim()) : null;
        };
        
        const code = getTagContent("code");
        const quantity = getTagContent("quantity") || "0";
        const active = getTagContent("active") === "1";
        const minOrder = getTagContent("min_order") || "1";
        
        // Price handling: price_netto is NETTO price
        // VAT is 8% for pet food (from <tax><value>8</value>)
        const priceNettoFromXml = getTagContent("price_netto");
        
        let finalPriceNetto = "0";
        if (priceNettoFromXml) {
          finalPriceNetto = priceNettoFromXml;
        }
        
        if (code) {
          stockMap.set(code, {
            quantity,
            price_netto: finalPriceNetto,
            active,
            min_order: minOrder
          });
        }
      } catch (error) {
        console.error("Error parsing stock entry:", error);
      }
    }
  } catch (error) {
    console.error("Error in parseStockXML:", error);
  }
  
  return stockMap;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const kategoria = url.searchParams.get('kategoria');
    const sku = url.searchParams.get('sku');

    console.log('Fetching XMLs from hurtownia...');
    
    // Fetch both XMLs in parallel
    const [mainResponse, stockResponse] = await Promise.all([
      fetch(XML_URL),
      fetch(XML_STANY_URL)
    ]);
    
    if (!mainResponse.ok) {
      throw new Error(`Failed to fetch main XML: ${mainResponse.statusText}`);
    }
    if (!stockResponse.ok) {
      throw new Error(`Failed to fetch stock XML: ${stockResponse.statusText}`);
    }

    const [mainXmlText, stockXmlText] = await Promise.all([
      mainResponse.text(),
      stockResponse.text()
    ]);
    
    console.log('XMLs fetched, parsing...');
    
    // Parse both XMLs
    let products = parseXMLProducts(mainXmlText);
    const stockMap = parseStockXML(stockXmlText);
    
    console.log(`Parsed ${products.length} products and ${stockMap.size} stock entries`);
    
    // Log sample product for debugging
    if (products.length > 0) {
      console.log('Sample product data:', JSON.stringify(products[0], null, 2));
    }
    
    // Merge stock data into products
    products = products.map(product => {
      const stockData = stockMap.get(product.sku);
      if (stockData) {
        return {
          ...product,
          cena_netto: stockData.price_netto,
          stan_magazynowy: stockData.quantity,
          aktywny: stockData.active,
          min_order: stockData.min_order
        };
      }
      return product;
    });

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
      console.log(`Filtering by category path: ${categoryPath}`);
      
      // Convert URL path (e.g., "psy/sucha-karma") to match XML structure (e.g., "Psy / Sucha karma")
      // Split by "/" and reconstruct with proper casing: first letter uppercase, rest lowercase for each segment
      const pathParts = categoryPath.split('/').map(part => {
        // Convert kebab-case to space-separated words with first letter uppercase
        const words = part.split('-');
        // Capitalize only the first letter of the first word, rest stays lowercase
        return words.map((word, idx) => {
          if (idx === 0) {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
          }
          return word.toLowerCase();
        }).join(' ');
      });
      
      // Build the category prefix to match against (e.g., "Psy / Sucha karma")
      const categoryPrefix = pathParts.join(' / ');
      console.log(`Looking for categories starting with: "${categoryPrefix}"`);
      
      products = products.filter(product => {
        return product.kategorie.some(cat => {
          // Check if any product category starts with our prefix (case-insensitive)
          const matches = cat.toLowerCase().startsWith(categoryPrefix.toLowerCase());
          if (matches) {
            console.log(`Match found: "${cat}" starts with "${categoryPrefix}"`);
          }
          return matches;
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
