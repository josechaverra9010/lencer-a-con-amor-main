import { useSearchParams, Link } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { SlidersHorizontal, X, ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useQuery } from "@tanstack/react-query";
import { getProducts, getCategories, getColors } from "@/services/apiService";

interface ProductFiltersProps {
  selectedCategory: string;
  selectedFilter: string | null;
  selectedColors: string[];
  selectedSizes: string[];
  minPrice: number;
  maxPrice: number;
  categories: string[];
  colorFilters: any[];
  allSizes: string[];
  activeFiltersCount: number;
  updateFilters: (updates: Record<string, string | string[] | null>) => void;
  toggleArrayFilter: (key: string, value: string, current: string[]) => void;
  clearFilters: () => void;
}

const ProductFilters = ({
  selectedCategory,
  selectedFilter,
  selectedColors,
  selectedSizes,
  minPrice,
  maxPrice,
  categories,
  colorFilters,
  allSizes,
  activeFiltersCount,
  updateFilters,
  toggleArrayFilter,
  clearFilters,
  onApply
}: ProductFiltersProps & { onApply?: () => void }) => (
  <div className="space-y-6">
    {/* Special Filters */}
    <Collapsible defaultOpen>
      <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-foreground font-medium">
        Colecciones
        <ChevronDown size={16} className="transition-transform duration-200" />
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-3 space-y-2 animate-fade-in">
        <button
          onClick={() => updateFilters({ filter: null })}
          className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-300 ${!selectedFilter
            ? "bg-primary/20 text-primary font-medium"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
        >
          Todas las piezas
        </button>
        <button
          onClick={() => updateFilters({ filter: "new" })}
          className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-300 ${selectedFilter === "new"
            ? "bg-primary/20 text-primary font-medium"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
        >
          Novedades
        </button>
        <button
          onClick={() => updateFilters({ filter: "sale" })}
          className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-300 ${selectedFilter === "sale"
            ? "bg-primary/20 text-primary font-medium"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
        >
          Ofertas
        </button>
      </CollapsibleContent>
    </Collapsible>

    {/* Categories */}
    <Collapsible defaultOpen>
      <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-foreground font-medium">
        Categorías
        <ChevronDown size={16} className="transition-transform duration-200" />
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-3 space-y-2 animate-fade-in">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => updateFilters({ category: category === "Todos" ? null : category })}
            className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-300 ${selectedCategory === category
              ? "bg-primary/20 text-primary font-medium"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
          >
            {category}
          </button>
        ))}
      </CollapsibleContent>
    </Collapsible>

    {/* Price Range */}
    <Collapsible defaultOpen>
      <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-foreground font-medium">
        Precio
        <ChevronDown size={16} className="transition-transform duration-200" />
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-4 space-y-4 animate-fade-in">
        <Slider
          value={[minPrice, maxPrice]}
          onValueChange={(val) => updateFilters({ min: val[0].toString(), max: val[1].toString() })}
          min={0}
          max={500000}
          step={5000}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>${minPrice.toLocaleString()}</span>
          <span>${maxPrice.toLocaleString()}</span>
        </div>
      </CollapsibleContent>
    </Collapsible>

    {/* Colors */}
    <Collapsible defaultOpen>
      <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-foreground font-medium">
        Color
        <ChevronDown size={16} className="transition-transform duration-200" />
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-3 animate-fade-in">
        <div className="flex flex-wrap gap-3">
          {colorFilters.map((color) => (
            <button
              key={color.name}
              onClick={() => toggleArrayFilter("color", color.name, selectedColors)}
              className={`w-8 h-8 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${selectedColors.includes(color.name)
                ? "border-primary scale-110 ring-2 ring-primary/30"
                : "border-border hover:scale-105"
                }`}
              style={{ backgroundColor: color.value }}
              title={color.name}
            >
              {selectedColors.includes(color.name) && (
                <Check
                  size={12}
                  className={
                    color.value.toLowerCase() === "#ffffff" ||
                      color.value.toLowerCase() === "#fffff0" ||
                      color.value.toLowerCase() === "#f5e1da" ||
                      color.value.toLowerCase() === "#f7e7ce" ||
                      color.value.toLowerCase() === "#e3c9a8"
                      ? "text-foreground"
                      : "text-white"
                  }
                />
              )}
            </button>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>

    {/* Sizes */}
    <Collapsible defaultOpen>
      <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-foreground font-medium">
        Talla
        <ChevronDown size={16} className="transition-transform duration-200" />
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-3 animate-fade-in">
        <div className="flex flex-wrap gap-2">
          {allSizes.map((size) => (
            <button
              key={size}
              onClick={() => toggleArrayFilter("size", size, selectedSizes)}
              className={`px-3 py-2 rounded-md border text-sm transition-all duration-300 ${selectedSizes.includes(size)
                ? "bg-primary/20 border-primary text-primary font-medium"
                : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                }`}
            >
              {size}
            </button>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>

    {/* Clear Filters */}
    <div className="pt-6 space-y-3">
      {onApply && (
        <Button onClick={onApply} className="w-full bg-primary text-primary-foreground">
          Ver resultados
        </Button>
      )}
      {activeFiltersCount > 0 && (
        <Button
          variant="outline"
          onClick={clearFilters}
          className="w-full border-border text-muted-foreground hover:text-foreground"
        >
          <X size={16} className="mr-2" />
          Limpiar filtros ({activeFiltersCount})
        </Button>
      )}
    </div>
  </div>
);

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Derive filters from URL
  const selectedCategory = searchParams.get("category") || "Todos";
  const selectedFilter = searchParams.get("filter");
  const selectedColors = useMemo(() => searchParams.getAll("color"), [searchParams]);
  const selectedSizes = useMemo(() => searchParams.getAll("size"), [searchParams]);
  const minPrice = parseInt(searchParams.get("min") || "0");
  const maxPrice = parseInt(searchParams.get("max") || "500000");
  const sortBy = searchParams.get("sort") || "default";

  const { data: products = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ["products", selectedCategory],
    queryFn: () => getProducts(selectedCategory),
  });

  const { data: categories = ["Todos"] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    select: (data) => ["Todos", ...data.map((c: any) => c.name)],
  });

  const { data: colorFilters = [] } = useQuery({
    queryKey: ["colors"],
    queryFn: getColors,
  });

  const allSizes = ["XS", "S", "M", "L", "XL", "2XL", "3XL", "32B", "34B", "36B", "38B", "Única"];

  const updateFilters = (updates: Record<string, string | string[] | null>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) {
        newParams.delete(key);
      } else if (Array.isArray(value)) {
        newParams.delete(key);
        value.forEach(v => newParams.append(key, v));
      } else {
        newParams.set(key, value);
      }
    });
    setSearchParams(newParams);
  };

  const toggleArrayFilter = (key: string, value: string, current: string[]) => {
    const next = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    updateFilters({ [key]: next });
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter handled by API if selectedCategory !== "Todos"
    // However, if we want client-side fallback or refined filtering:
    if (selectedCategory && selectedCategory !== "Todos") {
      result = result.filter((p) => {
        const cat = p.category;
        const catName = typeof cat === 'object' ? (cat as any).name : cat;
        return catName === selectedCategory;
      });
    }

    // Color filter
    if (selectedColors.length > 0) {
      result = result.filter((p) =>
        Array.isArray(p.colors) && p.colors.some((c) => selectedColors.includes(c.name))
      );
    }

    // Size filter
    if (selectedSizes.length > 0) {
      result = result.filter((p) =>
        Array.isArray(p.sizes) && p.sizes.some((s) => selectedSizes.includes(s))
      );
    }

    // Filter by type (New/Sale)
    if (selectedFilter === "new") {
      result = result.filter(p => p.isNew);
    } else if (selectedFilter === "sale") {
      result = result.filter(p => p.isSale);
    }

    // Price filter
    result = result.filter(
      (p) => p.price >= minPrice && p.price <= maxPrice
    );

    // Sort
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
    }

    return result;
  }, [products, selectedCategory, selectedFilter, selectedColors, selectedSizes, minPrice, maxPrice, sortBy]);

  const activeFiltersCount =
    (selectedCategory !== "Todos" ? 1 : 0) +
    (selectedFilter ? 1 : 0) +
    selectedColors.length +
    selectedSizes.length +
    (minPrice > 0 || maxPrice < 500000 ? 1 : 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl lg:text-5xl text-foreground mb-4">
              Nuestra Colección
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Descubre piezas únicas diseñadas para realzar tu belleza natural con elegancia y sofisticación.
            </p>
          </div>

          <div className="flex gap-8">
            {/* Desktop Filters */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24 space-y-6">
                <h2 className="font-serif text-xl text-foreground">Filtros</h2>
                <ProductFilters
                  selectedCategory={selectedCategory}
                  selectedFilter={selectedFilter}
                  selectedColors={selectedColors}
                  selectedSizes={selectedSizes}
                  minPrice={minPrice}
                  maxPrice={maxPrice}
                  categories={categories}
                  colorFilters={colorFilters}
                  allSizes={allSizes}
                  activeFiltersCount={activeFiltersCount}
                  updateFilters={updateFilters}
                  toggleArrayFilter={toggleArrayFilter}
                  clearFilters={clearFilters}
                />
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/50">
                <p className="text-sm text-muted-foreground">
                  {filteredProducts.length} productos
                </p>

                <div className="flex items-center gap-4">
                  {/* Mobile Filter Button */}
                  <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
                    <SheetTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="lg:hidden border-border"
                      >
                        <SlidersHorizontal size={16} className="mr-2" />
                        Filtros
                        {activeFiltersCount > 0 && (
                          <span className="ml-2 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                            {activeFiltersCount}
                          </span>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80 bg-card">
                      <SheetHeader>
                        <SheetTitle className="font-serif text-xl">Filtros</SheetTitle>
                        <SheetDescription className="sr-only">Ajusta los filtros para encontrar tus productos.</SheetDescription>
                      </SheetHeader>
                      <div className="mt-6 overflow-y-auto max-h-[calc(100vh-120px)] pr-2">
                        <ProductFilters
                          selectedCategory={selectedCategory}
                          selectedFilter={selectedFilter}
                          selectedColors={selectedColors}
                          selectedSizes={selectedSizes}
                          minPrice={minPrice}
                          maxPrice={maxPrice}
                          categories={categories}
                          colorFilters={colorFilters}
                          allSizes={allSizes}
                          activeFiltersCount={activeFiltersCount}
                          updateFilters={updateFilters}
                          toggleArrayFilter={toggleArrayFilter}
                          clearFilters={clearFilters}
                          onApply={() => setIsFiltersOpen(false)}
                        />
                      </div>
                    </SheetContent>
                  </Sheet>

                  {/* Sort */}
                  <select
                    value={sortBy}
                    onChange={(e) => updateFilters({ sort: e.target.value === "default" ? null : e.target.value })}
                    className="bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="default">Ordenar por</option>
                    <option value="newest">Más nuevos</option>
                    <option value="price-asc">Precio: menor a mayor</option>
                    <option value="price-desc">Precio: mayor a menor</option>
                  </select>
                </div>
              </div>

              {/* Active Filter Tags */}
              {activeFiltersCount > 0 && (
                <div className="flex flex-wrap gap-2 mb-8 animate-fade-in">
                  {selectedCategory !== "Todos" && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-muted text-foreground text-xs rounded-full border border-border">
                      {selectedCategory}
                      <button onClick={() => updateFilters({ category: null })} className="hover:text-primary">
                        <X size={12} />
                      </button>
                    </span>
                  )}
                  {selectedFilter && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-xs rounded-full border border-primary/20 font-medium">
                      {selectedFilter === "new" ? "Novedades" : "Ofertas"}
                      <button onClick={() => updateFilters({ filter: null })} className="hover:text-primary">
                        <X size={12} />
                      </button>
                    </span>
                  )}
                  {selectedColors.map(color => (
                    <span key={color} className="inline-flex items-center gap-1 px-3 py-1 bg-muted text-foreground text-xs rounded-full border border-border">
                      Color: {color}
                      <button onClick={() => toggleArrayFilter("color", color, selectedColors)} className="hover:text-primary">
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                  {selectedSizes.map(size => (
                    <span key={size} className="inline-flex items-center gap-1 px-3 py-1 bg-muted text-foreground text-xs rounded-full border border-border">
                      Talla: {size}
                      <button onClick={() => toggleArrayFilter("size", size, selectedSizes)} className="hover:text-primary">
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                  {(minPrice > 0 || maxPrice < 500000) && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-muted text-foreground text-xs rounded-full border border-border">
                      ${minPrice.toLocaleString()} - ${maxPrice.toLocaleString()}
                      <button onClick={() => updateFilters({ min: null, max: null })} className="hover:text-primary">
                        <X size={12} />
                      </button>
                    </span>
                  )}
                  <button
                    onClick={clearFilters}
                    className="text-xs text-primary hover:underline ml-2"
                  >
                    Borrar todo
                  </button>
                </div>
              )}

              {/* Products */}
              {filteredProducts.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-muted-foreground text-lg mb-4">
                    No se encontraron productos con los filtros seleccionados.
                  </p>
                  <Button onClick={clearFilters} variant="outline">
                    Limpiar filtros
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      name={product.name}
                      price={product.price}
                      originalPrice={product.originalPrice}
                      image={product.images[0]}
                      isNew={product.isNew}
                      isSale={product.isSale}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Products;
