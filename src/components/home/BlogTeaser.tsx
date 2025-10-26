import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const BlogTeaser = () => {
  const posts = [
    {
      id: 1,
      title: "Jak wybrać karmę dla kota z problemami nerkowymi?",
      excerpt:
        "Problemy z nerkami to częste schorzenie u kotów. Dowiedz się, jakie składniki powinny znaleźć się w diecie...",
      date: "15 stycznia 2025",
      category: "Zdrowie",
    },
    {
      id: 2,
      title: "Czytamy etykiety: 5 składników, na które warto uważać",
      excerpt:
        "Nie wszystkie karmy są równie dobre. Poznaj składniki, których powinniśmy unikać w żywieniu naszych pupili...",
      date: "10 stycznia 2025",
      category: "Poradniki",
    },
    {
      id: 3,
      title: "Czy pies może jeść warzywa? Kompletny przewodnik",
      excerpt:
        "Warzywa mogą być zdrowym dodatkiem do diety psa, ale nie wszystkie są bezpieczne. Sprawdź, które wybierać...",
      date: "5 stycznia 2025",
      category: "Żywienie",
    },
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground">Poradnik MiskaZdrowia</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Dzielimy się wiedzą i doświadczeniem, aby pomóc Ci w codziennej trosce o Twojego pupila
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Card key={post.id} className="group hover:shadow-medium transition-all overflow-hidden">
              <Link to={`/blog/${post.id}`}>
                <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/40"></div>
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                      {post.category}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{post.date}</span>
                    </div>
                  </div>
                  <h3 className="font-semibold font-heading text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center text-sm text-primary font-medium group-hover:gap-2 transition-all">
                    Czytaj więcej
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild size="lg" variant="outline">
            <Link to="/blog">Zobacz wszystkie artykuły</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BlogTeaser;
