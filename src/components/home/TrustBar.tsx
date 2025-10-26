import { Truck, ShieldCheck, Package } from "lucide-react";

const TrustBar = () => {
  const features = [
    {
      icon: Truck,
      title: "Szybka dostawa dla głodnych brzuszków",
      description: "Zamów do 12:00, a my wyślemy paczkę jeszcze dziś!",
    },
    {
      icon: ShieldCheck,
      title: "Starannie wyselekcjonowane karmy",
      description: "Oferujemy tylko te produkty, którym sami ufamy. Gwarancja zdrowego składu.",
    },
    {
      icon: Package,
      title: "Darmowa dostawa od 149 zł",
      description: "Bo zdrowe jedzenie powinno być łatwo dostępne.",
    },
  ];

  return (
    <section className="bg-secondary/40 py-12 border-y">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="flex flex-col items-center text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold font-heading text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
