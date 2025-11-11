import { ShoppingCart, User, Search, Menu, X, Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
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

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { cartItems, updateQuantity, removeFromCart, cartTotal, cartCount } = useCart();

  const dogCategories = {
    type: [
      { label: "Sucha", href: "/kategoria/dla-psa/sucha" },
      { label: "Mokra", href: "/kategoria/dla-psa/mokra" },
      { label: "Weterynaryjna", href: "/kategoria/dla-psa/weterynaryjna" },
      { label: "Przysmaki", href: "/kategoria/dla-psa/przysmaki" },
    ],
    needs: [
      { label: "Szczeniak", href: "/kategoria/dla-psa/szczeniak" },
      { label: "Dorosły", href: "/kategoria/dla-psa/dorosly" },
      { label: "Senior", href: "/kategoria/dla-psa/senior" },
      { label: "Hipoalergiczna", href: "/kategoria/dla-psa/hipoalergiczna" },
      { label: "Bezzbożowa", href: "/kategoria/dla-psa/bezbozowa" },
    ],
  };

  const catCategories = {
    type: [
      { label: "Sucha", href: "/kategoria/dla-kota/sucha" },
      { label: "Mokra", href: "/kategoria/dla-kota/mokra" },
      { label: "Weterynaryjna", href: "/kategoria/dla-kota/weterynaryjna" },
      { label: "Przysmaki", href: "/kategoria/dla-kota/przysmaki" },
    ],
    needs: [
      { label: "Kocię", href: "/kategoria/dla-kota/kocie" },
      { label: "Dorosły", href: "/kategoria/dla-kota/dorosly" },
      { label: "Senior", href: "/kategoria/dla-kota/senior" },
      { label: "Hipoalergiczna", href: "/kategoria/dla-kota/hipoalergiczna" },
      { label: "Bezzbożowa", href: "/kategoria/dla-kota/bezbozowa" },
    ],
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
                <NavigationMenuContent>
                  <div className="grid gap-3 p-6 w-[600px] grid-cols-3">
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-foreground">Rodzaj karmy</h4>
                      <ul className="space-y-2">
                        {dogCategories.type.map((item) => (
                          <li key={item.href}>
                            <NavigationMenuLink asChild>
                              <Link
                                to={item.href}
                                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                              >
                                {item.label}
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-foreground">Potrzeby</h4>
                      <ul className="space-y-2">
                        {dogCategories.needs.map((item) => (
                          <li key={item.href}>
                            <NavigationMenuLink asChild>
                              <Link
                                to={item.href}
                                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                              >
                                {item.label}
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <div className="rounded-lg bg-accent/10 p-4 space-y-2">
                        <img src="/placeholder.svg" alt="Promocja" className="w-full h-24 object-cover rounded-md" />
                        <Link to="/promocje/bezbozowa" className="block text-sm font-semibold text-accent hover:underline">
                          Promocja na karmy bezzbożowe!
                        </Link>
                      </div>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Dla Kota Mega Menu */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm font-medium">Dla Kota</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-6 w-[600px] grid-cols-3">
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-foreground">Rodzaj karmy</h4>
                      <ul className="space-y-2">
                        {catCategories.type.map((item) => (
                          <li key={item.href}>
                            <NavigationMenuLink asChild>
                              <Link
                                to={item.href}
                                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                              >
                                {item.label}
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-foreground">Potrzeby</h4>
                      <ul className="space-y-2">
                        {catCategories.needs.map((item) => (
                          <li key={item.href}>
                            <NavigationMenuLink asChild>
                              <Link
                                to={item.href}
                                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                              >
                                {item.label}
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <div className="rounded-lg bg-accent/10 p-4 space-y-2">
                        <img src="/placeholder.svg" alt="Promocja" className="w-full h-24 object-cover rounded-md" />
                        <Link to="/promocje/bezbozowa" className="block text-sm font-semibold text-accent hover:underline">
                          Promocja na karmy bezzbożowe!
                        </Link>
                      </div>
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
