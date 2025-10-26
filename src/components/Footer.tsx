import { Link } from "react-router-dom";
import { Facebook, Instagram, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-secondary/30 border-t mt-20">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold font-heading text-primary">MiskaZdrowia</h3>
            <p className="text-sm text-muted-foreground">
              Zdrowie i radość w każdej misce. Starannie wyselekcjonowane karmy dla Twojego pupila.
            </p>
            <div className="flex space-x-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="mailto:kontakt@miskazdrowia.pl"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Na Skróty */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold font-heading">Na skróty</h4>
            <nav className="flex flex-col space-y-2">
              <Link to="/dla-psa" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Dla Psa
              </Link>
              <Link to="/dla-kota" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Dla Kota
              </Link>
              <Link to="/marki" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Marki
              </Link>
              <Link to="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Blog
              </Link>
            </nav>
          </div>

          {/* Pomoc */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold font-heading">Pomoc</h4>
            <nav className="flex flex-col space-y-2">
              <Link to="/kontakt" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Kontakt
              </Link>
              <Link to="/dostawa" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Dostawa i płatność
              </Link>
              <Link to="/zwroty" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Zwroty i reklamacje
              </Link>
              <Link to="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                FAQ
              </Link>
            </nav>
          </div>

          {/* Twoje konto */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold font-heading">Twoje konto</h4>
            <nav className="flex flex-col space-y-2">
              <Link to="/konto" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Moje konto
              </Link>
              <Link to="/zamowienia" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Historia zamówień
              </Link>
              <Link to="/ulubione" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Ulubione
              </Link>
              <Link to="/newsletter" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Newsletter
              </Link>
            </nav>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} MiskaZdrowia. Wszelkie prawa zastrzeżone.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
