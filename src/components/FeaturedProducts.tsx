import ProductCard from "./ProductCard";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/services/apiService";
import { Link } from "react-router-dom";

const FeaturedProducts = () => {
  const { data: products = [], isLoading, isError } = useQuery({
    queryKey: ["featured-products"],
    queryFn: () => getProducts(),
    select: (data) => {
      const featured = data.filter(p => p.isNew || p.isSale);
      return (featured.length > 0 ? featured : data).slice(0, 4);
    }
  });

  return (
    <section className="py-20 lg:py-32" id="new">
      <div className="container px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 lg:mb-16">
          <div className="mb-6 lg:mb-0">
            <span className="text-gold text-sm tracking-[0.3em] uppercase mb-4 block">
              Selección Exclusiva
            </span>
            <h2 className="font-serif text-4xl lg:text-5xl font-light">
              Productos Destacados
            </h2>
          </div>
          <Link
            to="/productos"
            className="text-sm text-primary hover:text-rose-light transition-colors duration-300 tracking-wide uppercase flex items-center gap-2 group"
          >
            Ver todos los productos
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="aspect-square bg-card/50 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-10 text-muted-foreground">
            No se pudieron cargar los productos. Revisa la conexión con el servidor.
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {products.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ProductCard
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  originalPrice={product.originalPrice}
                  image={product.images[0]}
                  isNew={product.isNew}
                  isSale={product.isSale}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
