import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import aboutCatsImage from "@/assets/about-cats.jpg";

const AboutTeaser = () => {
  return (
    <section className="py-20 bg-secondary/20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-large order-2 lg:order-1">
            <img
              src={aboutCatsImage}
              alt="Trzy koty właścicieli MiskaZdrowia"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="space-y-6 order-1 lg:order-2">
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground">
              Sklep stworzony z miłości do zwierząt
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                MiskaZdrowia narodziła się z potrzeby serca. Kiedy nasze trzy koty zachorowały, przeszliśmy długą
                drogę, by znaleźć dla nich najlepsze żywienie.
              </p>
              <p>
                Dziś tą wiedzą i starannie dobranymi produktami chcemy dzielić się z Wami. Każda karma w naszym
                sklepie została wybrana z myślą o zdrowiu i szczęściu Waszych pupili.
              </p>
            </div>
            <Button asChild size="lg" variant="default">
              <Link to="/o-nas">Poznaj naszą historię</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutTeaser;
