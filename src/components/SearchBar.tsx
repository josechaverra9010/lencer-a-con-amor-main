import { useState, useRef, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/services/apiService";

interface SearchBarProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchBar = ({ isOpen, onClose }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: products = [] } = useQuery({
    queryKey: ["products", "search"],
    queryFn: () => getProducts(),
    enabled: isOpen,
  });

  const filteredProducts = useMemo(() =>
    query.length >= 2
      ? products.filter(
        (product) => {
          if (!product.category) return product.name.toLowerCase().includes(query.toLowerCase());
          const categoryProp = product.category as any;
          const catName = typeof categoryProp === 'object' ? categoryProp.name : categoryProp;
          return product.name.toLowerCase().includes(query.toLowerCase()) ||
            catName?.toLowerCase().includes(query.toLowerCase()) ||
            product.description.toLowerCase().includes(query.toLowerCase())
        }
      ).slice(0, 6)
      : [],
    [query, products]
  );

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm animate-fade-in">
      <div className="container mx-auto px-4 pt-24">
        <div className="max-w-2xl mx-auto">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={24} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar productos..."
              className="w-full h-16 pl-14 pr-14 text-xl bg-card border border-border rounded-lg focus:outline-none focus:border-primary transition-colors"
            />
            <button
              onClick={onClose}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Results */}
          {query.length >= 2 && (
            <div className="mt-6 bg-card border border-border rounded-lg overflow-hidden animate-fade-in">
              {filteredProducts.length > 0 ? (
                <div className="divide-y divide-border">
                  {filteredProducts.map((product) => (
                    <Link
                      key={product.id}
                      to={`/producto/${product.id}`}
                      onClick={onClose}
                      className="flex items-center gap-4 p-4 hover:bg-background/50 transition-colors"
                    >
                      <div className="w-16 h-16 rounded-md overflow-hidden bg-charcoal-light flex-shrink-0">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif text-lg text-foreground truncate">
                          {product.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {product.category ? (typeof product.category === 'object' ? (product.category as any).name : product.category) : ''}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-medium text-foreground">
                          ${product.price.toLocaleString()}
                        </span>
                        {product.originalPrice && (
                          <p className="text-sm text-muted-foreground line-through">
                            ${product.originalPrice.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  <p>No se encontraron productos para "{query}"</p>
                </div>
              )}
            </div>
          )}

          {/* Suggestions */}
          {query.length < 2 && (
            <div className="mt-8 text-center">
              <p className="text-muted-foreground mb-4">Búsquedas populares</p>
              <div className="flex flex-wrap justify-center gap-2">
                {["Conjuntos", "Bralettes", "Bodies", "Encaje", "Seda"].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-4 py-2 bg-card border border-border rounded-full text-sm hover:border-primary hover:text-primary transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
