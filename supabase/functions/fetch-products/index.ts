import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";

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
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlText, "text/xml");
  
  if (!doc) {
    throw new Error("Failed to parse XML");
  }

  const products: Product[] = [];
  const productNodes = doc.querySelectorAll("product");

  productNodes.forEach((productNode: any) => {
    try {
      const id = productNode.querySelector("id")?.textContent || "";
      const code = productNode.querySelector("code")?.textContent || "";
      const name = productNode.querySelector("name")?.textContent || "";
      const description = productNode.querySelector("description")?.textContent || null;
      const producer = productNode.querySelector("producer")?.textContent || "";
      const active = productNode.querySelector("active")?.textContent === "1";
      
      // Categories
      const categoryNodes = productNode.querySelectorAll("category");
      const categories: string[] = [];
      categoryNodes.forEach((cat: any) => {
        const catText = cat.textContent?.trim();
        if (catText) categories.push(catText);
      });

      // Prices
      const priceNetto = productNode.querySelector("price_netto")?.textContent || "0";
      const defaultPriceNetto = productNode.querySelector("default_price_netto")?.textContent || "0";
      
      // Stock
      const quantity = productNode.querySelector("quantity")?.textContent || "0";
      
      // Images
      const imageNodes = productNode.querySelectorAll("img url");
      const images: string[] = [];
      imageNodes.forEach((img: any) => {
        const url = img.textContent?.trim();
        if (url) images.push(url);
      });

      // Other details
      const weight = productNode.querySelector("weight")?.textContent || "0";
      const unit = productNode.querySelector("unit")?.textContent || "sztuka";
      
      // EAN
      const eanNode = productNode.querySelector('attribute[type="1"] value');
      const ean = eanNode?.textContent || null;

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
    } catch (error) {
      console.error("Error parsing product:", error);
    }
  });

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
