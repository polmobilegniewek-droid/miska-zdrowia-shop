import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-cat.jpg";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-[600px] py-20">
          {/* Content */}
          <div className="space-y-6 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-foreground leading-tight">
              Zdrowie i radość w każdej misce
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0">
              Wiemy, jak ważne jest zdrowie Twojego pupila. Oferujemy starannie wyselekcjonowane karmy, które sami
              podalibyśmy naszym zwierzakom.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button asChild size="lg" variant="cta">
                <Link to="/kategoria/dla-psa">Karma dla Psa</Link>
              </Button>
              <Button asChild size="lg" variant="default">
                <Link to="/kategoria/dla-kota">Karma dla Kota</Link>
              </Button>
            </div>
          </div>

          {/* Image */}
          <div className="relative lg:h-[500px] h-[400px] rounded-2xl overflow-hidden shadow-large">
            <img
              src={heroImage}
              alt="Szczęśliwy i zdrowy kotek z miską w domowym otoczeniu"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
