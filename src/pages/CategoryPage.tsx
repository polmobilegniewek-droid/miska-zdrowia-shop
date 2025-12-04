import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Star } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import placeholderImage from "/placeholder.svg";

interface Product {
  sku: string;
  nazwa: string;
  opis: string | null;
  cena_netto: string;
  stan_magazynowy: string;
  url_zdjecia: string | null;
}

const CategoryPage = () => {
  const { '*': kategoria } = useParams();
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  // Funkcja do normalizacji tekstu kategorii (usuwa polskie znaki, konwertuje na kebab-case)
  const normalizeCategory = (text: string): string => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // usuwa akcenty
      .replace(/ł/g, 'l')
      .replace(/ó/g, 'o')
      .replace(/ą/g, 'a')
      .replace(/ę/g, 'e')
      .replace(/ś/g, 's')
      .replace(/ć/g, 'c')
      .replace(/ź/g, 'z')
      .replace(/ż/g, 'z')
      .replace(/ń/g, 'n')
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  // Funkcja sprawdzająca czy produkt pasuje do kategorii
  const productMatchesCategory = (product: Product & { kategorie_xml?: string }, categoryPath: string): boolean => {
    if (!product.kategorie_xml || !categoryPath) return false;
    
    // Rozbij ścieżkę kategorii URL na segmenty
    const urlSegments = categoryPath.split('/').filter(Boolean);
    
    // Rozbij kategorie_xml na poszczególne ścieżki kategorii
    const xmlCategories = product.kategorie_xml.split(' || ');
    
    // Sprawdź każdą ścieżkę kategorii z XML
    for (const xmlCategory of xmlCategories) {
      // Rozbij ścieżkę XML na segmenty (np. "Koty / Sucha karma" -> ["Koty", "Sucha karma"])
      const xmlSegments = xmlCategory.split(' / ').map(s => s.trim());
      
      // Normalizuj segmenty XML
      const normalizedXmlSegments = xmlSegments.map(normalizeCategory);
      
      // Sprawdź czy ścieżka URL pasuje do początku ścieżki XML
      let matches = true;
      for (let i = 0; i < urlSegments.length; i++) {
        const normalizedUrlSegment = normalizeCategory(urlSegments[i]);
        if (i >= normalizedXmlSegments.length || normalizedXmlSegments[i] !== normalizedUrlSegment) {
          matches = false;
          break;
        }
      }
      
      if (matches) return true;
    }
    
    return false;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Pobieramy produkty z API
        const response = await fetch(`https://serwer2583155.home.pl/getProdukty.php?kategoria=${encodeURIComponent(kategoria || '')}`);
        
        if (!response.ok) {
          throw new Error('Nie udało się pobrać produktów');
        }
        
        const data = await response.json();
        
        // Filtrujemy produkty po stronie klienta dla dokładniejszego dopasowania
        const filteredProducts = kategoria 
          ? data.filter((product: Product & { kategorie_xml?: string }) => 
              productMatchesCategory(product, kategoria)
            )
          : data;
        
        setProducts(filteredProducts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Wystąpił błąd podczas ładowania produktów');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [kategoria]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 md:px-6">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold font-heading text-foreground mb-2">
              {kategoria ? kategoria.replace(/-/g, ' ') : 'Produkty'}
            </h1>
            <p className="text-muted-foreground">Znaleziono {products.length} produktów</p>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky top-20 space-y-6">
                <div className="bg-card rounded-lg border p-6">
                  <h2 className="text-lg font-semibold font-heading text-foreground mb-4">Filtry</h2>
                  
                  <Accordion type="multiple" defaultValue={["marka", "cena", "cechy"]} className="w-full">
                    {/* Marka Filter */}
                    <AccordionItem value="marka">
                      <AccordionTrigger className="text-sm font-medium">Marka</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-3 pt-2">
                          {["PetNature", "HealthyPet", "VetDiet", "NaturalChoice"].map((brand) => (
                            <div key={brand} className="flex items-center space-x-2">
                              <Checkbox id={brand} />
                              <label
                                htmlFor={brand}
                                className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                              >
                                {brand}
                              </label>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Cena Filter */}
                    <AccordionItem value="cena">
                      <AccordionTrigger className="text-sm font-medium">Cena</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 pt-2">
                          <Slider
                            min={0}
                            max={500}
                            step={10}
                            value={priceRange}
                            onValueChange={setPriceRange}
                            className="w-full"
                          />
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>{priceRange[0]} zł</span>
                            <span>{priceRange[1]} zł</span>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Cechy Filter */}
                    <AccordionItem value="cechy">
                      <AccordionTrigger className="text-sm font-medium">Cechy</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-3 pt-2">
                          {["Bezzbożowa", "Hipoalergiczna", "Dla seniora", "Naturalna", "Bio"].map((feature) => (
                            <div key={feature} className="flex items-center space-x-2">
                              <Checkbox id={feature} />
                              <label
                                htmlFor={feature}
                                className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                              >
                                {feature}
                              </label>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  <Button variant="outline" className="w-full mt-6">
                    Wyczyść filtry
                  </Button>
                </div>
              </div>
            </aside>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              {isLoading && (
                <div className="text-center py-12">
                  <p className="text-lg text-muted-foreground">Ładowanie produktów...</p>
                </div>
              )}
              
              {error && (
                <div className="text-center py-12">
                  <p className="text-lg text-destructive">{error}</p>
                </div>
              )}
              
              {!isLoading && !error && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <Card key={product.sku} className="group overflow-hidden hover:shadow-medium transition-all">
                      <Link to={`/produkt/${product.sku}`}>
                        <div className="relative aspect-square overflow-hidden bg-secondary/20">
                          <img
                            src={product.url_zdjecia || placeholderImage}
                            alt={product.nazwa}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <CardContent className="p-4 space-y-2">
                          <h2 className="font-semibold font-heading text-foreground line-clamp-2 min-h-[2.5rem]">
                            {product.nazwa}
                          </h2>
                          {product.opis && (
                            <p className="text-sm text-muted-foreground line-clamp-2">{product.opis}</p>
                          )}
                          <div className="flex items-center space-x-2">
                            <span className="text-xl font-bold text-foreground">{product.cena_netto} zł (netto)</span>
                          </div>
                          <p className="text-sm text-muted-foreground">Na stanie: {product.stan_magazynowy} szt.</p>
                        </CardContent>
                      </Link>
                      <CardFooter className="p-4 pt-0">
                        <Button 
                          variant="cta" 
                          className="w-full"
                          onClick={() => addToCart({
                            id: product.sku,
                            sku: product.sku,
                            name: product.nazwa,
                            price: parseFloat(product.cena_netto),
                            image: product.url_zdjecia || placeholderImage,
                          })}
                        >
                          Dodaj do koszyka
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryPage;
