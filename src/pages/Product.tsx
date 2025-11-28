import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, ShoppingCart, Heart, Shield, Package, Leaf } from "lucide-react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import placeholderImage from "/placeholder.svg";

interface Product {
  sku: string;
  nazwa: string;
  opis: string | null;
  cena_netto: string;
  stan_magazynowy: string;
  url_zdjecia: string | null;
  wszystkie_zdjecia: string[];
  aktywny: boolean;
  min_order?: string;
  producent: string;
  waga: string;
  jednostka: string;
  ean: string | null;
  kategorie: string[];
}

const calculateBrutto = (netto: string): number => {
  const nettoPrice = parseFloat(netto);
  return nettoPrice * 1.08; // VAT 8% dla karmy
};

const Product = () => {
  const { id: sku } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!sku) {
        setError("Brak SKU produktu");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(
          `https://mtutsynracpxihfcuehd.supabase.co/functions/v1/fetch-products?sku=${encodeURIComponent(sku)}`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        
        if (!response.ok) throw new Error('Failed to fetch product');
        
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Wystąpił błąd podczas pobierania produktu");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [sku]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-12">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground">Ładowanie produktu...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-12">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center py-20">
              <p className="text-xl text-red-500">Błąd: {error}</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-12">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground">Produkt nie został znaleziony</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 md:px-6">
          {/* Product Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-2xl overflow-hidden shadow-large bg-secondary/20">
                <img 
                  src={product.url_zdjecia || placeholderImage} 
                  alt={product.nazwa} 
                  className="w-full h-full object-cover" 
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">
                  {product.producent} | SKU: {product.sku}
                </p>
                <h1 className="text-3xl md:text-4xl font-bold font-heading text-foreground mb-3">
                  {product.nazwa}
                </h1>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-5 h-5 fill-accent text-accent" />
                    ))}
                  </div>
                  <span className="text-sm font-medium">4.9</span>
                  <span className="text-sm text-muted-foreground">(89 opinii)</span>
                </div>
                {product.opis && (
                  <div 
                    className="text-lg text-muted-foreground prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: product.opis }}
                  />
                )}
              </div>

              {/* Price */}
              <div className="bg-secondary/30 p-6 rounded-xl">
                <div className="space-y-2 mb-4">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-4xl font-bold text-foreground">
                      {calculateBrutto(product.cena_netto).toFixed(2)} zł
                    </span>
                    <span className="text-sm text-muted-foreground">brutto</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Cena netto: {parseFloat(product.cena_netto).toFixed(2)} zł
                  </p>
                </div>
                <div className="text-sm mb-4">
                  <span className={parseInt(product.stan_magazynowy) > 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                    {parseInt(product.stan_magazynowy) > 0 ? `Na stanie: ${product.stan_magazynowy} szt.` : 'Brak w magazynie'}
                  </span>
                  {product.min_order && parseInt(product.min_order) > 1 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Minimalne zamówienie: {product.min_order} szt.
                    </p>
                  )}
                </div>

                {/* Product Weight Info */}
                <div className="space-y-2 mb-4">
                  <p className="text-sm font-medium text-foreground">
                    Waga: <span className="text-muted-foreground">{product.waga} {product.jednostka}</span>
                  </p>
                  {product.ean && (
                    <p className="text-xs text-muted-foreground">
                      EAN: {product.ean}
                    </p>
                  )}
                </div>

                {/* Quantity */}
                <div className="space-y-2 mb-6">
                  <label className="text-sm font-medium text-foreground">Ilość:</label>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-lg border-2 border-border hover:border-primary transition-colors font-semibold"
                    >
                      -
                    </button>
                    <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 rounded-lg border-2 border-border hover:border-primary transition-colors font-semibold"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    variant="cta" 
                    size="lg" 
                    className="flex-1"
                    onClick={() => addToCart({
                      id: product.sku,
                      sku: product.sku,
                      name: product.nazwa,
                      price: calculateBrutto(product.cena_netto),
                      image: product.url_zdjecia || placeholderImage,
                      weight: `${product.waga} ${product.jednostka}`,
                      quantity: quantity,
                    })}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Dodaj do koszyka
                  </Button>
                  <Button variant="outline" size="lg">
                    <Heart className="w-5 h-5" />
                  </Button>
                </div>
                
                {/* Mini Trust Bar */}
                <div className="mt-6 pt-6 border-t space-y-3">
                  <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                    <Shield className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>Bezpieczne płatności Przelewy24</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                    <Package className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>Wysyłka w 24h</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                    <Leaf className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>Tylko sprawdzone składy</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="mt-16">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full max-w-xl grid-cols-3">
                <TabsTrigger value="description">Opis</TabsTrigger>
                <TabsTrigger value="composition">Skład</TabsTrigger>
                <TabsTrigger value="dosage">Dawkowanie</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="mt-8 space-y-4">
                <h3 className="text-2xl font-bold font-heading text-foreground">Opis produktu</h3>
                {product.opis ? (
                  <div 
                    className="prose prose-lg max-w-none text-muted-foreground space-y-4"
                    dangerouslySetInnerHTML={{ __html: product.opis }}
                  />
                ) : (
                  <p className="text-muted-foreground">Brak opisu produktu.</p>
                )}
              </TabsContent>
              <TabsContent value="composition" className="mt-8 space-y-4">
                <h3 className="text-2xl font-bold font-heading text-foreground">Skład</h3>
                <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
                  {product.opis ? (
                    <div dangerouslySetInnerHTML={{ __html: product.opis }} />
                  ) : (
                    <p>Szczegółowe informacje o składzie znajdziesz w pełnym opisie produktu.</p>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="dosage" className="mt-8 space-y-4">
                <h3 className="text-2xl font-bold font-heading text-foreground">Dawkowanie</h3>
                <div className="prose prose-lg max-w-none text-muted-foreground">
                  {product.opis ? (
                    <div dangerouslySetInnerHTML={{ __html: product.opis }} />
                  ) : (
                    <p>Informacje o dawkowaniu znajdziesz w pełnym opisie produktu. Pamiętaj o dostępie do świeżej wody pitnej.</p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Product;
