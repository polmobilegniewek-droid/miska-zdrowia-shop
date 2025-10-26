import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import productCatFood from "@/assets/product-cat-food.jpg";
import productDogFood from "@/assets/product-dog-food.jpg";

const Bestsellers = () => {
  const products = [
    {
      id: 1,
      name: "Premium Cat Food Natural",
      brand: "PetNature",
      price: 89.99,
      oldPrice: 99.99,
      rating: 4.8,
      reviews: 124,
      image: productCatFood,
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
      image: productDogFood,
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
      image: productCatFood,
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
      image: productDogFood,
      badge: "Bestseller",
    },
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground">Nasze Bestsellery</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Najchętniej wybierane przez właścicieli, uwielbianie przez pupile
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
