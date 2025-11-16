import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
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

const Bestsellers = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const functionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-products`;
        const response = await fetch(functionUrl);
        
        if (!response.ok) {
          throw new Error('Nie udało się pobrać produktów');
        }
        
        const data = await response.json();
        // Weź pierwsze 4 produkty jako bestsellery
        setProducts(data.slice(0, 4));
      } catch (err) {
        console.error('Błąd podczas ładowania produktów:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground">Nasze Bestsellery</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Najchętniej wybierane przez właścicieli, uwielbianie przez pupile
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            // Loading Skeletons
            Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <Skeleton className="aspect-square w-full" />
                <CardContent className="p-4 space-y-2">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-28" />
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))
          ) : (
            products.map((product) => (
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
                  <h3 className="font-semibold font-heading text-foreground line-clamp-2 min-h-[2.5rem]">
                    {product.nazwa}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-foreground">{parseFloat(product.cena_netto).toFixed(2)} zł</span>
                  </div>
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
          ))
          )}
        </div>

        <div className="text-center mt-12">
          <Button asChild size="lg" variant="outline">
            <Link to="/kategoria/dla-psa">Zobacz wszystkie produkty</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Bestsellers;
