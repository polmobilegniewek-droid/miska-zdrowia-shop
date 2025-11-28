import { ShoppingCart, User, Search, Menu, X, Minus, Plus, Trash2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import placeholderImage from "/placeholder.svg";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface CategoryItem {
  label: string;
  href: string;
}

interface Subcategory {
  label: string;
  href?: string;
  hasSubItems?: boolean;
  items: CategoryItem[];
}

interface Category {
  label: string;
  href: string;
  subcategories: Subcategory[];
}

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [dogCategories, setDogCategories] = useState<Category[]>([]);
  const [catCategories, setCatCategories] = useState<Category[]>([]);
  const { cartItems, updateQuantity, removeFromCart, cartTotal, cartCount } = useCart();

  // Fetch and build categories from products
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('fetch-products');
        
        if (error) {
          console.error('Error fetching products:', error);
          throw error;
        }
        
        console.log('Fetched products:', data?.slice(0, 2)); // Log first 2 products
        const products = data as any[];
        
        // Build category tree from product categories
        const dogCats = buildCategoryTree(products, 'Psy');
        const catCats = buildCategoryTree(products, 'Koty');
        
        console.log('Dog categories built:', dogCats);
        console.log('Cat categories built:', catCats);
        
        setDogCategories(dogCats);
        setCatCategories(catCats);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Helper function to build category tree
  const buildCategoryTree = (products: any[], animalType: string): Category[] => {
    const categoryMap = new Map<string, Set<string>>();

    console.log(`Building tree for ${animalType}, total products:`, products.length);
    
    products.forEach(product => {
      if (!product.kategorie || !Array.isArray(product.kategorie)) {
        return;
      }
      
      product.kategorie.forEach((cat: string) => {
        const normalizedCat = cat.trim();
        
        // Check if category starts with animal type (case-insensitive)
        if (normalizedCat.toLowerCase().startsWith(animalType.toLowerCase())) {
          const parts = normalizedCat.split('/').map(p => p.trim());
          
          // Build complete category hierarchy - store all paths
          for (let i = 1; i < parts.length; i++) {
            const key = parts.slice(0, i + 1).join('/');
            
            if (!categoryMap.has(key)) {
              categoryMap.set(key, new Set());
            }
            
            // Add child if exists
            if (i < parts.length - 1) {
              const childPath = parts.slice(0, i + 2).join('/');
              categoryMap.get(key)?.add(childPath);
            }
          }
        }
      });
    });

    console.log('Category map for', animalType, ':', Array.from(categoryMap.keys()).slice(0, 10));

    // Helper to create slug
    const createSlug = (text: string) => text.toLowerCase()
      .replace(/\s+/g, '-')
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    // Build tree recursively
    const buildSubcategories = (parentPath: string, level: number): Subcategory[] => {
      const children = categoryMap.get(parentPath);
      if (!children || children.size === 0) return [];

      const subcats: Subcategory[] = [];
      const parentParts = parentPath.split('/').map(p => p.trim());
      const animalPrefix = animalType.toLowerCase();

      children.forEach(childPath => {
        const childParts = childPath.split('/').map(p => p.trim());
        if (childParts.length !== parentParts.length + 1) return;

        const label = childParts[childParts.length - 1];
        const slugs = childParts.slice(1).map(createSlug);
        const href = `/kategoria/${animalPrefix}/${slugs.join('/')}`;
        
        const grandChildren = buildSubcategories(childPath, level + 1);
        
        // Convert Subcategory[] to CategoryItem[] for compatibility
        const items: CategoryItem[] = grandChildren.map(gc => ({
          label: gc.label,
          href: gc.href || ''
        }));

        subcats.push({
          label,
          href: items.length === 0 ? href : undefined,
          hasSubItems: items.length > 0,
          items
        });
      });

      return subcats;
    };

    // Build root categories
    const rootCategories: Category[] = [];
    const animalPrefix = animalType.toLowerCase();

    categoryMap.forEach((children, path) => {
      const parts = path.split('/').map(p => p.trim());
      
      // Root level (e.g., "Psy/Sucha karma")
      if (parts.length === 2 && parts[0].toLowerCase() === animalType.toLowerCase()) {
        const categoryLabel = parts[1];
        const categorySlug = createSlug(categoryLabel);
        const subcategories = buildSubcategories(path, 2);
        
        rootCategories.push({
          label: categoryLabel,
          href: `/kategoria/${animalPrefix}/${categorySlug}`,
          subcategories
        });
      }
    });

    return rootCategories;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="flex flex-col">
            <span className="text-xl font-bold font-heading text-primary">MiskaZdrowia</span>
            <span className="text-xs text-muted-foreground hidden sm:block">Zdrowie w każdej misce</span>
          </div>
        </Link>

        {/* Desktop Navigation with Mega Menu */}
        <nav className="hidden md:flex items-center space-x-1">
          <NavigationMenu>
            <NavigationMenuList>
              {/* Dla Psa Mega Menu */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm font-medium">Dla Psa</NavigationMenuTrigger>
                <NavigationMenuContent className="overflow-visible">
                  <div className="p-4 w-[300px] overflow-visible">
                    <div className="flex flex-col gap-1">
                      {dogCategories.map((category) => (
                        <div key={category.href} className="relative group overflow-visible">
                          <Link
                            to={category.href}
                            className={`block text-sm hover:text-primary transition-colors py-2 px-3 rounded-md hover:bg-accent/50 ${
                              category.subcategories.length > 0 
                                ? 'font-bold text-foreground' 
                                : 'font-medium text-muted-foreground'
                            }`}
                          >
                            {category.label}
                          </Link>
                          {category.subcategories.length > 0 && (
                            <div 
                              className="absolute left-full top-0 ml-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 bg-popover border rounded-lg shadow-xl p-4 w-[280px] z-[9999] animate-fade-in min-h-full"
                            >
                              <div className="flex flex-col gap-3">
                                {category.subcategories.map((subcat) => (
                                  <div key={subcat.label} className="relative group/third">
                                    {subcat.hasSubItems ? (
                                      <>
                                        <div className="flex items-center justify-between text-sm font-bold text-foreground pb-1 cursor-pointer hover:text-primary transition-colors">
                                          {subcat.label}
                                          <ChevronRight className="h-4 w-4" />
                                        </div>
                                        <div 
                                          className="absolute left-full top-0 ml-2 opacity-0 invisible group-hover/third:opacity-100 group-hover/third:visible transition-all duration-200 bg-popover border rounded-lg shadow-xl p-4 w-[240px] z-[10000] animate-fade-in min-h-full"
                                        >
                                          <ul className="space-y-2">
                                            {subcat.items.map((item) => (
                                              <li key={item.href}>
                                                <Link
                                                  to={item.href}
                                                  className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1.5 px-2 rounded-md hover:bg-accent/50"
                                                >
                                                  {item.label}
                                                </Link>
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      </>
                                    ) : subcat.items.length === 0 && subcat.href ? (
                                      <Link
                                        to={subcat.href}
                                        className="block text-sm font-normal text-muted-foreground hover:text-primary transition-colors py-1.5 px-2 rounded-md hover:bg-accent/50"
                                      >
                                        {subcat.label}
                                      </Link>
                                    ) : (
                                      <>
                                        <div className="text-sm font-bold text-foreground pb-1">
                                          {subcat.label}
                                        </div>
                                        <ul className="space-y-2">
                                          {subcat.items.map((item) => (
                                            <li key={item.href}>
                                              <Link
                                                to={item.href}
                                                className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1.5 px-2 rounded-md hover:bg-accent/50"
                                              >
                                                {item.label}
                                              </Link>
                                            </li>
                                          ))}
                                        </ul>
                                      </>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Dla Kota Mega Menu */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm font-medium">Dla Kota</NavigationMenuTrigger>
                <NavigationMenuContent className="overflow-visible">
                  <div className="p-4 w-[300px] overflow-visible">
                    <div className="flex flex-col gap-1">
                      {catCategories.map((category) => (
                        <div key={category.href} className="relative group overflow-visible">
                          <Link
                            to={category.href}
                            className={`block text-sm hover:text-primary transition-colors py-2 px-3 rounded-md hover:bg-accent/50 ${
                              category.subcategories.length > 0 
                                ? 'font-bold text-foreground' 
                                : 'font-medium text-muted-foreground'
                            }`}
                          >
                            {category.label}
                          </Link>
                          {category.subcategories.length > 0 && (
                            <div 
                              className="absolute left-full top-0 ml-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 bg-popover border rounded-lg shadow-xl p-4 w-[280px] z-[9999] animate-fade-in min-h-full"
                            >
                              <div className="flex flex-col gap-3">
                                {category.subcategories.map((subcat) => (
                                  <div key={subcat.label} className="relative group/third">
                                    {subcat.hasSubItems ? (
                                      <>
                                        <div className="flex items-center justify-between text-sm font-bold text-foreground pb-1 cursor-pointer hover:text-primary transition-colors">
                                          {subcat.label}
                                          <ChevronRight className="h-4 w-4" />
                                        </div>
                                        <div 
                                          className="absolute left-full top-0 ml-2 opacity-0 invisible group-hover/third:opacity-100 group-hover/third:visible transition-all duration-200 bg-popover border rounded-lg shadow-xl p-4 w-[240px] z-[10000] animate-fade-in min-h-full"
                                        >
                                          <ul className="space-y-2">
                                            {subcat.items.map((item) => (
                                              <li key={item.href}>
                                                <Link
                                                  to={item.href}
                                                  className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1.5 px-2 rounded-md hover:bg-accent/50"
                                                >
                                                  {item.label}
                                                </Link>
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      </>
                                    ) : subcat.items.length === 0 && subcat.href ? (
                                      <Link
                                        to={subcat.href}
                                        className="block text-sm font-normal text-muted-foreground hover:text-primary transition-colors py-1.5 px-2 rounded-md hover:bg-accent/50"
                                      >
                                        {subcat.label}
                                      </Link>
                                    ) : (
                                      <>
                                        <div className="text-sm font-bold text-foreground pb-1">
                                          {subcat.label}
                                        </div>
                                        <ul className="space-y-2">
                                          {subcat.items.map((item) => (
                                            <li key={item.href}>
                                              <Link
                                                to={item.href}
                                                className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1.5 px-2 rounded-md hover:bg-accent/50"
                                              >
                                                {item.label}
                                              </Link>
                                            </li>
                                          ))}
                                        </ul>
                                      </>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Regular Links */}
          <Link to="/marki" className="text-sm font-medium text-foreground hover:text-primary transition-colors px-4 py-2">
            Marki
          </Link>
          <Link to="/blog" className="text-sm font-medium text-foreground hover:text-primary transition-colors px-4 py-2">
            Blog
          </Link>
          <Link to="/o-nas" className="text-sm font-medium text-foreground hover:text-primary transition-colors px-4 py-2">
            O nas
          </Link>
          <Link to="/kontakt" className="text-sm font-medium text-foreground hover:text-primary transition-colors px-4 py-2">
            Kontakt
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {/* Search Input (Desktop) */}
          <div className="hidden lg:flex items-center relative">
            <Input
              placeholder="Szukaj produktów..."
              className="w-[200px] pr-8"
              onClick={() => setSearchOpen(true)}
              readOnly
            />
            <Search className="h-4 w-4 absolute right-3 text-muted-foreground pointer-events-none" />
          </div>
          
          {/* Search Icon (Mobile/Tablet) */}
          <Button 
            variant="ghost" 
            size="icon" 
            aria-label="Wyszukiwarka"
            className="lg:hidden"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon" aria-label="Konto">
            <User className="h-5 w-5" />
          </Button>
          
          {/* Cart Sheet */}
          <Sheet open={cartOpen} onOpenChange={setCartOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Koszyk" className="relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center">
                  {cartCount}
                </span>
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-lg flex flex-col">
              <SheetHeader>
                <SheetTitle className="text-2xl font-heading">Twój koszyk</SheetTitle>
              </SheetHeader>
              
              <div className="flex-1 overflow-y-auto py-6">
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-secondary/20 flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        {item.brand && <p className="text-xs text-muted-foreground uppercase tracking-wide">{item.brand}</p>}
                        <h4 className="font-semibold text-foreground text-sm line-clamp-2">{item.name}</h4>
                        <p className="text-sm font-bold text-foreground mt-1">{item.price.toFixed(2)} zł</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-muted-foreground"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4 border-t pt-6">
                <div className="flex items-center justify-between text-lg font-semibold">
                  <span className="text-foreground">Suma całkowita:</span>
                  <span className="text-foreground">{cartTotal.toFixed(2)} zł</span>
                </div>
                <Button variant="cta" size="lg" className="w-full" onClick={() => setCartOpen(false)}>
                  Przejdź do kasy
                </Button>
                <Button variant="outline" size="lg" className="w-full" onClick={() => setCartOpen(false)}>
                  Kontynuuj zakupy
                </Button>
              </div>
            </SheetContent>
          </Sheet>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-card">
          <nav className="container mx-auto flex flex-col space-y-3 px-4 py-4">
            <Link to="/dla-psa" className="text-sm font-medium text-foreground hover:text-primary">
              Dla Psa
            </Link>
            <Link to="/dla-kota" className="text-sm font-medium text-foreground hover:text-primary">
              Dla Kota
            </Link>
            <Link to="/marki" className="text-sm font-medium text-foreground hover:text-primary">
              Marki
            </Link>
            <Link to="/blog" className="text-sm font-medium text-foreground hover:text-primary">
              Blog
            </Link>
            <Link to="/o-nas" className="text-sm font-medium text-foreground hover:text-primary">
              O nas
            </Link>
            <Link to="/kontakt" className="text-sm font-medium text-foreground hover:text-primary">
              Kontakt
            </Link>
          </nav>
        </div>
      )}

      {/* Search Modal */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Wyszukaj produkt</DialogTitle>
          </DialogHeader>
          <Command className="rounded-lg border-0">
            <CommandInput placeholder="Wpisz nazwę produktu, markę..." />
            <CommandList>
              <CommandEmpty>Nie znaleziono produktów.</CommandEmpty>
              <CommandGroup heading="Sugerowane">
                <CommandItem>
                  <Link to="/produkt/1" className="flex-1" onClick={() => setSearchOpen(false)}>
                    Grain-Free Dog Food Adult - HealthyPet
                  </Link>
                </CommandItem>
                <CommandItem>
                  <Link to="/produkt/2" className="flex-1" onClick={() => setSearchOpen(false)}>
                    Premium Cat Food Natural - PetNature
                  </Link>
                </CommandItem>
                <CommandItem>
                  <Link to="/produkt/3" className="flex-1" onClick={() => setSearchOpen(false)}>
                    Senior Cat Food Kidney Care - VetDiet
                  </Link>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Header;
