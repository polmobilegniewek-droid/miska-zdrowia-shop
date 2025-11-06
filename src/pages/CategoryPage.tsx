import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Star } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import placeholderImage from "/placeholder.svg";

const CategoryPage = () => {
  const { nazwa } = useParams();
  const [priceRange, setPriceRange] = useState([0, 500]);

  const products = [
    {
      id: 1,
      name: "Premium Cat Food Natural",
      brand: "PetNature",
      price: 89.99,
      oldPrice: 99.99,
      rating: 4.8,
      reviews: 124,
      image: placeholderImage,
      badge: "Bestseller",
    },
    {
      id: 2,
      name: "Grain-Free Dog Food Adult",
      brand: "HealthyPet",
      price: 129.99,
      oldPrice: null,
      rating: 4.9,
      reviews: 89,
      image: placeholderImage,
      badge: "Nowość",
    },
    {
      id: 3,
      name: "Senior Cat Food Kidney Care",
      brand: "VetDiet",
      price: 99.99,
      oldPrice: 119.99,
      rating: 4.7,
      reviews: 56,
      image: placeholderImage,
      badge: null,
    },
    {
      id: 4,
      name: "Puppy Food Chicken & Rice",
      brand: "HealthyPet",
      price: 109.99,
      oldPrice: null,
      rating: 4.9,
      reviews: 201,
      image: placeholderImage,
      badge: "Bestseller",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 md:px-6">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold font-heading text-foreground mb-2">
              {nazwa ? nazwa.replace(/-/g, ' ') : 'Produkty'}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Card key={product.id} className="group overflow-hidden hover:shadow-medium transition-all">
                    <Link to={`/produkt/${product.id}`}>
                      <div className="relative aspect-square overflow-hidden bg-secondary/20">
                        {product.badge && (
                          <span className="absolute top-3 left-3 z-10 bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded-full">
                            {product.badge}
                          </span>
                        )}
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <CardContent className="p-4 space-y-2">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">{product.brand}</p>
                        <h3 className="font-semibold font-heading text-foreground line-clamp-2 min-h-[2.5rem]">
                          {product.name}
                        </h3>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 fill-accent text-accent" />
                          <span className="text-sm font-medium">{product.rating}</span>
                          <span className="text-sm text-muted-foreground">({product.reviews})</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xl font-bold text-foreground">{product.price.toFixed(2)} zł</span>
                          {product.oldPrice && (
                            <span className="text-sm text-muted-foreground line-through">{product.oldPrice.toFixed(2)} zł</span>
                          )}
                        </div>
                      </CardContent>
                    </Link>
                    <CardFooter className="p-4 pt-0">
                      <Button variant="cta" className="w-full">
                        Dodaj do koszyka
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryPage;
