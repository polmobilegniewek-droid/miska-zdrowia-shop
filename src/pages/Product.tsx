import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, ShoppingCart, Heart, Shield, Package, Leaf } from "lucide-react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import placeholderImage from "/placeholder.svg";

interface Product {
  sku: string;
  nazwa: string;
  opis: string | null;
  cena_netto: string;
  stan_magazynowy: string;
  url_zdjecia: string | null;
}

const Product = () => {
  const { id: sku } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedWeight, setSelectedWeight] = useState("2kg");
  const [quantity, setQuantity] = useState(1);

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
        const response = await fetch(`https://serwer2583155.home.pl/getProductDetails.php?sku=${sku}`);
        
        if (!response.ok) {
          throw new Error("Nie udało się pobrać danych produktu");
        }

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

  const weights = [
    { value: "2kg", price: 129.99 },
    { value: "5kg", price: 289.99 },
    { value: "10kg", price: 519.99 },
  ];

  const currentPrice = weights.find((w) => w.value === selectedWeight)?.price || 129.99;

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
                <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">SKU: {product.sku}</p>
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
                <div className="flex items-baseline space-x-2 mb-4">
                  <span className="text-3xl font-bold text-foreground">{parseFloat(product.cena_netto).toFixed(2)} zł</span>
                  <span className="text-sm text-muted-foreground">(netto)</span>
                </div>
                <div className="text-sm text-muted-foreground mb-4">
                  Na stanie: {product.stan_magazynowy} szt.
                </div>

                {/* Weight Selection */}
                <div className="space-y-2 mb-4">
                  <label className="text-sm font-medium text-foreground">Wybierz wagę:</label>
                  <div className="grid grid-cols-3 gap-2">
                    {weights.map((weight) => (
                      <button
                        key={weight.value}
                        onClick={() => setSelectedWeight(weight.value)}
                        className={`py-3 px-4 rounded-lg border-2 transition-all font-medium ${
                          selectedWeight === weight.value
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background hover:border-primary/50"
                        }`}
                      >
                        {weight.value}
                      </button>
                    ))}
                  </div>
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
                    onClick={() => toast.success("Produkt dodano do koszyka", {
                      description: "Możesz kontynuować zakupy lub przejść do koszyka"
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
                  <p>
                    <strong className="text-foreground">Analiza składu:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-2 pl-4">
                    <li>Białko surowe: 28%</li>
                    <li>Tłuszcz surowy: 16%</li>
                    <li>Włókno surowe: 3%</li>
                    <li>Popiół surowy: 8%</li>
                    <li>Wilgotność: 9%</li>
                  </ul>
                  <p className="mt-4">
                    <strong className="text-foreground">Składniki:</strong> Świeże mięso kurczaka (32%), suszone mięso
                    kurczaka (22%), słodkie ziemniaki, groszek, olej z łososia, pulpa buraczana, lniany nasiona, algi
                    morskie, glukozamina, chondroityna, ekstrakt z yucca, owoce i warzywa (marchew, szpinak,
                    jagody), naturalne przeciwutleniacze.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="dosage" className="mt-8 space-y-4">
                <h3 className="text-2xl font-bold font-heading text-foreground">Dawkowanie</h3>
                <div className="prose prose-lg max-w-none text-muted-foreground">
                  <p>
                    Zalecane dzienne dawki dla dorosłych psów (podawać w 2 porcjach dziennie). Pamiętaj o dostępie do
                    świeżej wody pitnej.
                  </p>
                  <div className="overflow-x-auto mt-6">
                    <table className="min-w-full border-collapse border border-border">
                      <thead>
                        <tr className="bg-secondary/30">
                          <th className="border border-border px-4 py-3 text-left font-semibold text-foreground">
                            Waga psa
                          </th>
                          <th className="border border-border px-4 py-3 text-left font-semibold text-foreground">
                            Dzienna porcja
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-border px-4 py-3">5-10 kg</td>
                          <td className="border border-border px-4 py-3">70-120 g</td>
                        </tr>
                        <tr className="bg-secondary/10">
                          <td className="border border-border px-4 py-3">10-20 kg</td>
                          <td className="border border-border px-4 py-3">120-200 g</td>
                        </tr>
                        <tr>
                          <td className="border border-border px-4 py-3">20-30 kg</td>
                          <td className="border border-border px-4 py-3">200-280 g</td>
                        </tr>
                        <tr className="bg-secondary/10">
                          <td className="border border-border px-4 py-3">30-40 kg</td>
                          <td className="border border-border px-4 py-3">280-360 g</td>
                        </tr>
                        <tr>
                          <td className="border border-border px-4 py-3">40+ kg</td>
                          <td className="border border-border px-4 py-3">360+ g</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
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
