import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import placeholderImage from "/placeholder.svg";

const Bestsellers = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for 1 second
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

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
          ))
          )}
        </div>

        <div className="text-center mt-12">
          <Button asChild size="lg" variant="outline">
            <Link to="/produkty">Zobacz wszystkie produkty</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Bestsellers;
