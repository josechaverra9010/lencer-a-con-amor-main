import { Link } from "react-router-dom";
import { ArrowLeft, Heart, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { products } from "@/data/products";

const Wishlist = () => {
  const { items, removeItem } = useWishlist();
  const { addItem } = useCart();

  const handleAddToCart = (itemId: number) => {
    const product = products.find((p) => p.id === itemId);
    if (product) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        size: product.sizes[0],
        color: product.colors[0].name,
      });
      toast({
        title: "Añadido al carrito",
        description: `${product.name} ha sido añadido al carrito.`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft size={18} />
            <span>Volver al inicio</span>
          </Link>

          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <Heart className="text-primary" size={32} />
              <h1 className="font-serif text-4xl text-foreground">Lista de Deseos</h1>
              {items.length > 0 && (
                <span className="text-muted-foreground">({items.length} productos)</span>
              )}
            </div>

            {items.length === 0 ? (
              <div className="bg-card border border-border rounded-lg p-12 text-center">
                <Heart size={64} className="mx-auto text-muted-foreground/30 mb-4" />
                <h2 className="font-serif text-2xl text-foreground mb-2">
                  Tu lista de deseos está vacía
                </h2>
                <p className="text-muted-foreground mb-6">
                  Guarda tus productos favoritos para comprarlos más tarde
                </p>
                <Button
                  asChild
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Link to="/productos">Explorar Productos</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-card border border-border rounded-lg p-4 flex items-center gap-6 animate-fade-in"
                  >
                    <Link
                      to={`/producto/${item.id}`}
                      className="w-24 h-24 rounded-md overflow-hidden bg-charcoal-light flex-shrink-0"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </Link>

                    <div className="flex-1 min-w-0">
                      <Link to={`/producto/${item.id}`}>
                        <h3 className="font-serif text-xl text-foreground hover:text-primary transition-colors truncate">
                          {item.name}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-lg font-medium text-foreground">
                          ${item.price.toLocaleString()}
                        </span>
                        {item.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            ${item.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Añadido: {new Date(item.addedAt).toLocaleDateString('es-ES')}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => handleAddToCart(item.id)}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        <ShoppingBag size={18} className="mr-2" />
                        Añadir
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          removeItem(item.id);
                          toast({
                            title: "Eliminado",
                            description: "Producto eliminado de tu lista de deseos.",
                          });
                        }}
                        className="border-border text-muted-foreground hover:text-destructive hover:border-destructive"
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Wishlist;
