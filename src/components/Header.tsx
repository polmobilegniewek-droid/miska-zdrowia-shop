import { ShoppingCart, User, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/dla-psa" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Dla Psa
          </Link>
          <Link to="/dla-kota" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Dla Kota
          </Link>
          <Link to="/marki" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Marki
          </Link>
          <Link to="/blog" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Blog
          </Link>
          <Link to="/o-nas" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            O nas
          </Link>
          <Link to="/kontakt" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Kontakt
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" aria-label="Wyszukiwarka">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Konto">
            <User className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Koszyk" className="relative">
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center">
              0
            </span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            <Menu className="h-5 w-5" />
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
    </header>
  );
};

export default Header;
