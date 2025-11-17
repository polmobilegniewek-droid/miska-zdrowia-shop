import { ShoppingCart, User, Search, Menu, X, Minus, Plus, Trash2, ChevronRight } from "lucide-react";
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
  const { cartItems, updateQuantity, removeFromCart, cartTotal, cartCount } = useCart();

  const dogCategories = [
    {
      label: "Sucha karma",
      href: "/kategoria/psy/sucha-karma",
      subcategories: [
        {
          label: "Karma wg. smaku",
          hasSubItems: true,
          items: [
            { 
              label: "Bez kurczaka", 
              href: "/kategoria/psy/sucha-karma/karma-wg-smaku/bez-kurczaka",
            },
            { 
              label: "Oparta na kurczaku", 
              href: "/kategoria/psy/sucha-karma/karma-wg-smaku/oparta-na-kurczaku",
            },
            { 
              label: "Oparta na króliku", 
              href: "/kategoria/psy/sucha-karma/karma-wg-smaku/oparta-na-kroliku",
            },
            { 
              label: "Oparta na indyku", 
              href: "/kategoria/psy/sucha-karma/karma-wg-smaku/oparta-na-indyku",
            },
            { 
              label: "Oparta na wołowinie", 
              href: "/kategoria/psy/sucha-karma/karma-wg-smaku/oparta-na-wolowinie",
            },
            { 
              label: "Oparta na jagnięcinie", 
              href: "/kategoria/psy/sucha-karma/karma-wg-smaku/oparta-na-jagniecinie",
            },
            { 
              label: "Oparta na wieprzowinie", 
              href: "/kategoria/psy/sucha-karma/karma-wg-smaku/oparta-na-wieprzowinie",
            },
            { 
              label: "Oparta na rybie", 
              href: "/kategoria/psy/sucha-karma/karma-wg-smaku/oparta-na-rybie",
            },
            { 
              label: "Oparta na dziczyźnie", 
              href: "/kategoria/psy/sucha-karma/karma-wg-smaku/oparta-na-dzicczyznie",
            },
          ]
        },
        {
          label: "Karma wg. wieku",
          hasSubItems: true,
          items: [
            { 
              label: "Dla szczeniąt", 
              href: "/kategoria/psy/sucha-karma/karma-wg-wieku/dla-szczeniat",
            },
            { 
              label: "Psy dorosłe", 
              href: "/kategoria/psy/sucha-karma/karma-wg-wieku/psy-dorosle",
            },
            { 
              label: "Dla seniora", 
              href: "/kategoria/psy/sucha-karma/karma-wg-wieku/dla-seniora",
            },
          ]
        },
        {
          label: "Karma wg. wielkości",
          hasSubItems: true,
          items: [
            { 
              label: "Rasy małe", 
              href: "/kategoria/psy/sucha-karma/karma-wg-wielkosci/rasy-male",
            },
            { 
              label: "Rasy średnie", 
              href: "/kategoria/psy/sucha-karma/karma-wg-wielkosci/rasy-srednie",
            },
            { 
              label: "Rasy duże", 
              href: "/kategoria/psy/sucha-karma/karma-wg-wielkosci/rasy-duze",
            },
          ]
        },
        {
          label: "Bezzbożowa",
          href: "/kategoria/psy/sucha-karma/bezbozowa",
          items: []
        },
        {
          label: "Karma Light/Senior",
          href: "/kategoria/psy/sucha-karma/karma-light-senior",
          items: []
        },
      ]
    },
    {
      label: "Mokra karma",
      href: "/kategoria/psy/mokra-karma",
      subcategories: [
        {
          label: "Puszki 400g",
          href: "/kategoria/psy/mokra-karma/puszki-400g",
          items: []
        },
        {
          label: "Puszki 800g+",
          href: "/kategoria/psy/mokra-karma/puszki-800g",
          items: []
        },
        {
          label: "Saszetki",
          href: "/kategoria/psy/mokra-karma/saszetki",
          items: []
        },
        {
          label: "Zestawy",
          href: "/kategoria/psy/mokra-karma/zestawy",
          items: []
        },
      ]
    },
    {
      label: "Przysmaki",
      href: "/kategoria/psy/przysmaki",
      subcategories: [
        {
          label: "Kości",
          href: "/kategoria/psy/przysmaki/kosci",
          items: []
        },
        {
          label: "Do żucia",
          href: "/kategoria/psy/przysmaki/do-zucia",
          items: []
        },
        {
          label: "Ciastka i łakocie",
          href: "/kategoria/psy/przysmaki/ciastka-i-lakocie",
          items: []
        },
        {
          label: "Pozostałe",
          href: "/kategoria/psy/przysmaki/pozostale",
          items: []
        },
        {
          label: "Treningowe",
          href: "/kategoria/psy/przysmaki/treningowe",
          items: []
        },
        {
          label: "Naturalne i gryzaki",
          href: "/kategoria/psy/przysmaki/naturalne-i-gryzaki",
          items: []
        },
        {
          label: "Półwilgotne",
          href: "/kategoria/psy/przysmaki/polwilgotne",
          items: []
        },
        {
          label: "Zestawy",
          href: "/kategoria/psy/przysmaki/zestawy",
          items: []
        },
      ]
    },
    {
      label: "Próbki karm",
      href: "/kategoria/psy/probki-karm",
      subcategories: []
    },
    {
      label: "Akcesoria i zdrowie",
      href: "/kategoria/psy/akcesoria-i-zdrowie",
      subcategories: [
        {
          label: "Miski",
          href: "/kategoria/psy/akcesoria-i-zdrowie/miski",
          items: []
        },
        {
          label: "Legowiska dla psów",
          href: "/kategoria/psy/akcesoria-i-zdrowie/legowiska-dla-psow",
          items: []
        },
        {
          label: "Zabawki",
          href: "/kategoria/psy/akcesoria-i-zdrowie/zabawki",
          items: []
        },
        {
          label: "Smycze i szelki",
          href: "/kategoria/psy/akcesoria-i-zdrowie/smycze-i-szelki",
          items: []
        },
        {
          label: "Obroże i kagańce",
          href: "/kategoria/psy/akcesoria-i-zdrowie/obroze-i-kaganince",
          items: []
        },
        {
          label: "Szczotki i grzebienie",
          href: "/kategoria/psy/akcesoria-i-zdrowie/szczotki-i-grzebienie",
          items: []
        },
        {
          label: "Transportery",
          href: "/kategoria/psy/akcesoria-i-zdrowie/transportery",
          items: []
        },
        {
          label: "Podkłady higieniczne",
          href: "/kategoria/psy/akcesoria-i-zdrowie/podklady-higieniczne",
          items: []
        },
        {
          label: "Ubranka dla psa",
          href: "/kategoria/psy/akcesoria-i-zdrowie/ubranka-dla-psa",
          items: []
        },
        {
          label: "Gadżety",
          href: "/kategoria/psy/akcesoria-i-zdrowie/gadzety",
          items: []
        },
        {
          label: "Maty chłodzące",
          href: "/kategoria/psy/akcesoria-i-zdrowie/maty-chlodzace",
          items: []
        },
        {
          label: "Witaminy i suplementy",
          href: "/kategoria/psy/akcesoria-i-zdrowie/witaminy-i-suplementy",
          items: []
        },
        {
          label: "Szampony i ochrona",
          href: "/kategoria/psy/akcesoria-i-zdrowie/szampony-i-ochrona",
          items: []
        },
      ]
    },
  ];

  const catCategories = [
    {
      label: "Sucha karma",
      href: "/kategoria/koty/sucha-karma",
      subcategories: [
        {
          label: "Karma wg. smaku",
          hasSubItems: true,
          items: [
            { 
              label: "Bez kurczaka", 
              href: "/kategoria/koty/sucha-karma/karma-wg-smaku/bez-kurczaka",
            },
            { 
              label: "Oparta na kurczaku", 
              href: "/kategoria/koty/sucha-karma/karma-wg-smaku/oparta-na-kurczaku",
            },
            { 
              label: "Oparta na króliku", 
              href: "/kategoria/koty/sucha-karma/karma-wg-smaku/oparta-na-kroliku",
            },
            { 
              label: "Oparta na indyku", 
              href: "/kategoria/koty/sucha-karma/karma-wg-smaku/oparta-na-indyku",
            },
            { 
              label: "Oparta na wołowinie", 
              href: "/kategoria/koty/sucha-karma/karma-wg-smaku/oparta-na-wolowinie",
            },
            { 
              label: "Oparta na jagnięcinie", 
              href: "/kategoria/koty/sucha-karma/karma-wg-smaku/oparta-na-jagniecinie",
            },
            { 
              label: "Oparta na wieprzowinie", 
              href: "/kategoria/koty/sucha-karma/karma-wg-smaku/oparta-na-wieprzowinie",
            },
            { 
              label: "Oparta na rybie", 
              href: "/kategoria/koty/sucha-karma/karma-wg-smaku/oparta-na-rybie",
            },
            { 
              label: "Oparta na dziczyźnie", 
              href: "/kategoria/koty/sucha-karma/karma-wg-smaku/oparta-na-dzicczyznie",
            },
          ]
        },
        {
          label: "Karma wg. wieku",
          hasSubItems: true,
          items: [
            { 
              label: "Dla kociąt", 
              href: "/kategoria/koty/sucha-karma/karma-wg-wieku/dla-kociat",
            },
            { 
              label: "Koty dorosłe", 
              href: "/kategoria/koty/sucha-karma/karma-wg-wieku/koty-dorosle",
            },
            { 
              label: "Dla seniora", 
              href: "/kategoria/koty/sucha-karma/karma-wg-wieku/dla-seniora",
            },
          ]
        },
        {
          label: "Bezzbożowa",
          href: "/kategoria/koty/sucha-karma/bezbozowa",
          items: []
        },
        {
          label: "Karma Light/Senior",
          href: "/kategoria/koty/sucha-karma/karma-light-senior",
          items: []
        },
      ]
    },
    {
      label: "Mokra karma dla kota",
      href: "/kategoria/koty/mokra-karma-dla-kota",
      subcategories: [
        {
          label: "Puszki",
          href: "/kategoria/koty/mokra-karma-dla-kota/puszki",
          items: []
        },
        {
          label: "Saszetki",
          href: "/kategoria/koty/mokra-karma-dla-kota/saszetki",
          items: []
        },
        {
          label: "Zestawy",
          href: "/kategoria/koty/mokra-karma-dla-kota/zestawy",
          items: []
        },
      ]
    },
    {
      label: "Przysmaki",
      href: "/kategoria/koty/przysmaki",
      subcategories: []
    },
    {
      label: "Zestawy",
      href: "/kategoria/koty/zestawy",
      subcategories: []
    },
    {
      label: "Próbki karm",
      href: "/kategoria/koty/probki-karm",
      subcategories: []
    },
    {
      label: "Akcesoria i suplementy",
      href: "/kategoria/koty/akcesoria-i-suplementy",
      subcategories: [
        {
          label: "Miski",
          href: "/kategoria/koty/akcesoria-i-suplementy/miski",
          items: []
        },
        {
          label: "Żwirek dla kota",
          href: "/kategoria/koty/akcesoria-i-suplementy/zwirek-dla-kota",
          items: []
        },
        {
          label: "Kuwety",
          href: "/kategoria/koty/akcesoria-i-suplementy/kuwety",
          items: []
        },
        {
          label: "Legowiska",
          href: "/kategoria/koty/akcesoria-i-suplementy/legowiska",
          items: []
        },
        {
          label: "Zabawki",
          href: "/kategoria/koty/akcesoria-i-suplementy/zabawki",
          items: []
        },
        {
          label: "Transportery",
          href: "/kategoria/koty/akcesoria-i-suplementy/transportery",
          items: []
        },
        {
          label: "Szczotki i grzebienie",
          href: "/kategoria/koty/akcesoria-i-suplementy/szczotki-i-grzebienie",
          items: []
        },
        {
          label: "Smycze i szelki",
          href: "/kategoria/koty/akcesoria-i-suplementy/smycze-i-szelki",
          items: []
        },
        {
          label: "Obroże",
          href: "/kategoria/koty/akcesoria-i-suplementy/obroze",
          items: []
        },
        {
          label: "Siatki",
          href: "/kategoria/koty/akcesoria-i-suplementy/siatki",
          items: []
        },
        {
          label: "Drapaki",
          href: "/kategoria/koty/akcesoria-i-suplementy/drapaki",
          items: []
        },
        {
          label: "Gadżety",
          href: "/kategoria/koty/akcesoria-i-suplementy/gadzety",
          items: []
        },
        {
          label: "Witaminy i suplementy",
          href: "/kategoria/koty/akcesoria-i-suplementy/witaminy-i-suplementy",
          items: []
        },
        {
          label: "Szampony i ochrona",
          href: "/kategoria/koty/akcesoria-i-suplementy/szampony-i-ochrona",
          items: []
        },
      ]
    },
  ];

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
                            className="block text-sm font-semibold text-foreground hover:text-primary transition-colors py-2 px-3 rounded-md hover:bg-accent/50"
                          >
                            {category.label}
                          </Link>
                          {category.subcategories.length > 0 && (
                            <div className="opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 fixed bg-popover border rounded-lg shadow-xl p-4 w-[280px] z-[9999] animate-fade-in" 
                              style={{
                                left: 'var(--submenu-left)',
                                top: 'var(--submenu-top)'
                              }}
                              onMouseEnter={(e) => {
                                const rect = e.currentTarget.parentElement?.getBoundingClientRect();
                                if (rect) {
                                  e.currentTarget.style.setProperty('--submenu-left', `${rect.right + 8}px`);
                                  e.currentTarget.style.setProperty('--submenu-top', `${rect.top}px`);
                                }
                              }}>
                              <div className="flex flex-col gap-3">
                                {category.subcategories.map((subcat) => (
                                  <div key={subcat.label} className="relative group/third">
                                    {subcat.hasSubItems ? (
                                      <>
                                        <div className="flex items-center justify-between text-sm font-semibold text-foreground pb-1 cursor-pointer hover:text-primary transition-colors">
                                          {subcat.label}
                                          <ChevronRight className="h-4 w-4" />
                                        </div>
                                        <div className="opacity-0 invisible group-hover/third:opacity-100 group-hover/third:visible transition-all duration-200 fixed bg-popover border rounded-lg shadow-xl p-4 w-[240px] z-[10000] animate-fade-in"
                                          style={{
                                            left: 'var(--third-menu-left)',
                                            top: 'var(--third-menu-top)'
                                          }}
                                          onMouseEnter={(e) => {
                                            const rect = e.currentTarget.parentElement?.getBoundingClientRect();
                                            if (rect) {
                                              e.currentTarget.style.setProperty('--third-menu-left', `${rect.right + 8}px`);
                                              e.currentTarget.style.setProperty('--third-menu-top', `${rect.top}px`);
                                            }
                                          }}>
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
                                        className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1.5 px-2 rounded-md hover:bg-accent/50"
                                      >
                                        {subcat.label}
                                      </Link>
                                    ) : (
                                      <>
                                        <div className="text-sm font-semibold text-foreground pb-1">
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
                            className="block text-sm font-semibold text-foreground hover:text-primary transition-colors py-2 px-3 rounded-md hover:bg-accent/50"
                          >
                            {category.label}
                          </Link>
                          {category.subcategories.length > 0 && (
                            <div className="opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 fixed bg-popover border rounded-lg shadow-xl p-4 w-[280px] z-[9999] animate-fade-in"
                              style={{
                                left: 'var(--submenu-left)',
                                top: 'var(--submenu-top)'
                              }}
                              onMouseEnter={(e) => {
                                const rect = e.currentTarget.parentElement?.getBoundingClientRect();
                                if (rect) {
                                  e.currentTarget.style.setProperty('--submenu-left', `${rect.right + 8}px`);
                                  e.currentTarget.style.setProperty('--submenu-top', `${rect.top}px`);
                                }
                              }}>
                              <div className="flex flex-col gap-3">
                                {category.subcategories.map((subcat) => (
                                  <div key={subcat.label} className="relative group/third">
                                    {subcat.hasSubItems ? (
                                      <>
                                        <div className="flex items-center justify-between text-sm font-semibold text-foreground pb-1 cursor-pointer hover:text-primary transition-colors">
                                          {subcat.label}
                                          <ChevronRight className="h-4 w-4" />
                                        </div>
                                        <div className="opacity-0 invisible group-hover/third:opacity-100 group-hover/third:visible transition-all duration-200 fixed bg-popover border rounded-lg shadow-xl p-4 w-[240px] z-[10000] animate-fade-in"
                                          style={{
                                            left: 'var(--third-menu-left)',
                                            top: 'var(--third-menu-top)'
                                          }}
                                          onMouseEnter={(e) => {
                                            const rect = e.currentTarget.parentElement?.getBoundingClientRect();
                                            if (rect) {
                                              e.currentTarget.style.setProperty('--third-menu-left', `${rect.right + 8}px`);
                                              e.currentTarget.style.setProperty('--third-menu-top', `${rect.top}px`);
                                            }
                                          }}>
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
                                        className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1.5 px-2 rounded-md hover:bg-accent/50"
                                      >
                                        {subcat.label}
                                      </Link>
                                    ) : (
                                      <>
                                        <div className="text-sm font-semibold text-foreground pb-1">
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
