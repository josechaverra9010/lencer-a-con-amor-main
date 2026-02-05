import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/services/apiService";
import { useNavigate } from "react-router-dom";

const categoryDescriptions: Record<string, string> = {
  "Brasiers": "Comodidad y estilo",
  "Conjuntos": "Looks completos",
  "Babydolls": "Seducción pura",
  "Pijamas": "Dulces sueños",
  "Bodies": "Seducción y elegancia",
  "Kimonos": "Elegancia natural",
  "Panties": "Uso diario",
  "Corsets": "Silueta perfecta"
};

const Categories = () => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const navigate = useNavigate();

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories
  });

  return (
    <section className="py-20 lg:py-32 bg-muted/30" id="collections">
      <div className="container px-4 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <span className="text-gold text-sm tracking-[0.3em] uppercase mb-4 block">
            Explora
          </span>
          <h2 className="font-serif text-4xl lg:text-5xl font-light mb-4">
            Nuestras Categorías
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Encuentra la pieza perfecta para cada ocasión en nuestra selección curada.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {isLoading ? (
            [1, 2, 3, 4].map(n => (
              <div key={n} className="h-40 bg-card animate-pulse rounded-lg" />
            ))
          ) : (
            categories.slice(0, 8).map((category: any) => (
              <div
                key={category.id}
                onClick={() => navigate(`/productos?category=${category.name}`)}
                className="group relative bg-gradient-card rounded-lg p-6 lg:p-8 cursor-pointer transition-all duration-500 hover:shadow-glow border border-border/50 hover:border-primary/30"
                onMouseEnter={() => setHoveredId(category.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="relative z-10">
                  <h3 className="font-serif text-xl lg:text-2xl mb-2 text-foreground group-hover:text-primary transition-colors duration-300">
                    {category.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {categoryDescriptions[category.name] || "Colección exclusiva"}
                  </p>
                  <span className="text-xs text-gold tracking-wide uppercase">
                    Ver Colección
                  </span>
                </div>

                {/* Hover effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-lg transition-opacity duration-500 ${hoveredId === category.id ? "opacity-100" : "opacity-0"
                    }`}
                />

                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden">
                  <div className="absolute top-0 right-0 w-px h-8 bg-gradient-to-b from-primary/50 to-transparent transform origin-top group-hover:scale-y-150 transition-transform duration-500" />
                  <div className="absolute top-0 right-0 h-px w-8 bg-gradient-to-l from-primary/50 to-transparent transform origin-right group-hover:scale-x-150 transition-transform duration-500" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Categories;
