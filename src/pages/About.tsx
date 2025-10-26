import Header from "@/components/Header";
import Footer from "@/components/Footer";
import aboutCatsImage from "@/assets/about-cats.jpg";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-secondary/20 to-background py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold font-heading text-foreground">Witaj w Misce Zdrowia!</h1>
              <p className="text-xl text-muted-foreground">Cieszymy się, że tu jesteś.</p>
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto space-y-8">
              {/* Image */}
              <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-large">
                <img
                  src={aboutCatsImage}
                  alt="Trzy koty, które rozpoczęły naszą przygodę"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="prose prose-lg max-w-none space-y-6 text-muted-foreground">
                <p>
                  Nasza historia zaczyna się od trzech kotów: Whiskersa, Mittens i Simby. To dla nich, a właściwie
                  przez nich, powstała Miska Zdrowia. Kilka lat temu nasze kociaki zachorowały – jedno po drugim
                  zaczęły mieć problemy zdrowotne, które zmusiły nas do zrewidowania ich diety.
                </p>

                <p>
                  Wtedy zrozumieliśmy, jak wiele zależy od tego, co ląduje w misce naszych pupili. Jak ogromne
                  znaczenie ma jakość składników, jak ważne jest czytanie etykiet i jak trudno jest w natłoku
                  produktów wybrać ten, który naprawdę pomoże, a nie zaszkodzi.
                </p>

                <p>
                  Spędziliśmy miesiące na edukacji – czytając artykuły, rozmawiając z weterynarzami, testując różne
                  karmy. Było trudno, frustrująco, ale też inspirująco. Bo kiedy w końcu znaleźliśmy odpowiednie
                  produkty, zdrowie naszych kotów zaczęło wracać do normy. I to był moment, w którym pomyśleliśmy:
                  <strong className="text-foreground">
                    "Jeśli tyle czasu zajęło nam znalezienie dobrej karmy, ile czasu zabiera to innym opiekunom
                    zwierząt?"
                  </strong>
                </p>

                <h2 className="text-2xl md:text-3xl font-bold font-heading text-foreground mt-12">
                  Misja Miski Zdrowia
                </h2>

                <p>
                  MiskaZdrowia to nie jest po prostu kolejny sklep zoologiczny. To miejsce stworzone z myślą o
                  właścicielach, którzy – tak jak my – chcą dla swoich pupili tylko tego, co najlepsze. Oferujemy
                  karmy, które sami podalibyśmy naszym zwierzakom. Karmy, które przeszły przez nasze ręce, przez nasze
                  badania, przez nasze serca.
                </p>

                <p>
                  Każdy produkt w naszym sklepie został wybrany z rozwagą. Patrzymy na skład, pochodzenie składników,
                  reputację producentów. Nie interesuje nas tylko to, co popularne – interesuje nas to, co zdrowe.
                </p>

                <h2 className="text-2xl md:text-3xl font-bold font-heading text-foreground mt-12">
                  Co nas wyróżnia?
                </h2>

                <ul className="list-disc list-inside space-y-3 pl-4">
                  <li>
                    <strong className="text-foreground">Osobiste doświadczenie:</strong> Wiemy, co to znaczy martwić
                    się o zdrowie zwierzaka. Sami przez to przeszliśmy.
                  </li>
                  <li>
                    <strong className="text-foreground">Starannie wyselekcjonowany asortyment:</strong> W naszym
                    sklepie znajdziesz tylko te produkty, którym ufamy.
                  </li>
                  <li>
                    <strong className="text-foreground">Wsparcie i edukacja:</strong> Chcemy nie tylko sprzedawać, ale
                    też dzielić się wiedzą. Na naszym blogu znajdziesz porady, artykuły i inspiracje.
                  </li>
                  <li>
                    <strong className="text-foreground">Serce i pasja:</strong> Nie jesteśmy korporacją. Jesteśmy
                    ludźmi, którzy kochają zwierzęta i chcą, żeby żyły długo, zdrowo i szczęśliwie.
                  </li>
                </ul>

                <h2 className="text-2xl md:text-3xl font-bold font-heading text-foreground mt-12">
                  Dlaczego warto nam zaufać?
                </h2>

                <p>
                  Bo nie robimy tego dla pieniędzy – robimy to dla Was i Waszych pupili. Bo każda karma, którą
                  oferujemy, jest produktem, który sami przetestowaliśmy lub który został nam polecony przez
                  specjalistów, którym ufamy.
                </p>

                <p>
                  Zdrowie Twojego zwierzaka jest dla nas priorytetem. Dlatego jeśli masz jakiekolwiek pytania, nie
                  wahaj się do nas napisać. Chętnie pomożemy, doradzimy, podzielimy się wiedzą.
                </p>

                <div className="bg-secondary/30 p-8 rounded-2xl mt-12 text-center">
                  <p className="text-xl font-semibold font-heading text-foreground mb-4">
                    Dziękujemy, że jesteście z nami. Razem zadbamy o zdrowie Waszych pupili!
                  </p>
                  <p className="text-lg text-primary font-medium">Z miłością i troską,</p>
                  <p className="text-lg text-primary font-semibold">Zespół MiskaZdrowia</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
