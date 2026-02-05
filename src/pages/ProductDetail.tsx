import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, Heart, ShoppingBag, Minus, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { toast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { getProductById } from "@/services/apiService";

const ProductDetail = () => {
  const { id } = useParams();
  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id as string),
    enabled: !!id,
  });

  const { addItem } = useCart();
  const { isInWishlist, toggleItem } = useWishlist();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 pb-20 container mx-auto px-4 text-center">
          <p className="text-muted-foreground animate-pulse">Cargando producto...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 pb-20 container mx-auto px-4 text-center">
          <h1 className="font-serif text-3xl text-foreground mb-4">Producto no encontrado</h1>
          <Link to="/productos" className="text-primary hover:underline">
            Volver al catálogo
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const isLiked = isInWishlist(product.id);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast({
        title: "Selecciona una talla",
        description: "Por favor, elige una talla antes de añadir al carrito.",
        variant: "destructive",
      });
      return;
    }
    if (!selectedColor) {
      toast({
        title: "Selecciona un color",
        description: "Por favor, elige un color antes de añadir al carrito.",
        variant: "destructive",
      });
      return;
    }

    addItem(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        size: selectedSize,
        color: selectedColor,
      },
      quantity
    );

    toast({
      title: "Añadido al carrito",
      description: `${quantity}x ${product.name} (${selectedSize}, ${selectedColor})`,
    });
  };

  const handleToggleWishlist = () => {
    toggleItem({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images[0],
    });
    toast({
      title: isLiked ? "Eliminado de favoritos" : "Añadido a favoritos",
      description: isLiked
        ? `${product.name} ha sido eliminado de tu lista de deseos.`
        : `${product.name} ha sido añadido a tu lista de deseos.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Breadcrumb */}
          <Link
            to="/productos"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ChevronLeft size={18} />
            <span>Volver al catálogo</span>
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="aspect-square overflow-hidden rounded-lg bg-charcoal-light relative">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover animate-fade-in"
                />
                {product.isNew && (
                  <span className="absolute top-4 left-4 px-3 py-1 bg-gold text-accent-foreground text-xs font-medium tracking-wide rounded-sm">
                    NUEVO
                  </span>
                )}
                {product.isSale && discount > 0 && (
                  <span className="absolute top-4 right-4 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium tracking-wide rounded-sm">
                    -{discount}%
                  </span>
                )}
              </div>

              <div className="grid grid-cols-4 gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-md overflow-hidden border-2 transition-all duration-300 ${selectedImage === index
                      ? "border-primary shadow-glow"
                      : "border-transparent hover:border-border"
                      }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <p className="text-sm text-primary font-medium tracking-wide uppercase mb-2">
                  {product.category ? (typeof product.category === 'object' ? product.category.name : product.category) : ''}
                </p>
                <h1 className="font-serif text-3xl lg:text-4xl text-foreground mb-4">
                  {product.name}
                </h1>
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4">
                <span className="text-3xl font-medium text-foreground">
                  ${product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">
                      ${product.originalPrice.toLocaleString()}
                    </span>
                    <span className="px-2 py-1 bg-primary/20 text-primary text-sm font-medium rounded">
                      Ahorras ${(product.originalPrice - product.price).toLocaleString()}
                    </span>
                  </>
                )}
              </div>

              {/* Color Selector */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">
                  Color: <span className="text-muted-foreground">{selectedColor || "Selecciona"}</span>
                </label>
                <div className="flex gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`w-10 h-10 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${selectedColor === color.name
                        ? "border-primary scale-110"
                        : "border-border hover:border-muted-foreground"
                        }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    >
                      {selectedColor === color.name && (
                        <Check
                          size={16}
                          className={
                            color.value === "#ffffff" || color.value === "#fffff0" || color.value === "#f5e1da" || color.value === "#f7e7ce" || color.value === "#e3c9a8"
                              ? "text-charcoal"
                              : "text-white"
                          }
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selector */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">
                  Talla: <span className="text-muted-foreground">{selectedSize || "Selecciona"}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[48px] h-10 px-4 rounded-md border transition-all duration-300 font-medium text-sm ${selectedSize === size
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Cantidad</label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-border rounded-md">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 hover:text-primary transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-3 hover:text-primary transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-base font-medium"
                >
                  <ShoppingBag size={20} className="mr-2" />
                  Añadir al Carrito
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleToggleWishlist}
                  className={`w-14 h-14 border-border ${isLiked ? "text-primary border-primary" : "text-muted-foreground"
                    }`}
                >
                  <Heart size={20} className={isLiked ? "fill-primary" : ""} />
                </Button>
              </div>

              {/* Features */}
              {product.features && (
                <div className="pt-6 border-t border-border/50 space-y-3">
                  <h3 className="text-sm font-medium text-foreground">Características</h3>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check size={14} className="text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
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

export default ProductDetail;
