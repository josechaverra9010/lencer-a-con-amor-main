import { Minus, Plus, Trash2, ShoppingBag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetDescription,
} from "@/components/ui/sheet";
import { useCart } from "@/contexts/CartContext";
import { Separator } from "@/components/ui/separator";

const CartDrawer = () => {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, totalPrice, totalItems } = useCart();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-lg bg-card border-border flex flex-col">
        <SheetHeader className="space-y-0 pb-4">
          <SheetTitle className="font-serif text-2xl text-foreground flex items-center gap-3">
            <ShoppingBag className="text-primary" size={24} />
            Tu Carrito
            {totalItems > 0 && (
              <span className="text-sm font-sans font-normal text-muted-foreground">
                ({totalItems} {totalItems === 1 ? "artículo" : "artículos"})
              </span>
            )}
          </SheetTitle>
          <SheetDescription className="sr-only">Revisa los artículos en tu carrito antes de pagar.</SheetDescription>
        </SheetHeader>

        <Separator className="bg-border/50" />

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-muted-foreground">
            <ShoppingBag size={64} className="opacity-30" />
            <p className="font-serif text-xl">Tu carrito está vacío</p>
            <Button
              onClick={() => setIsOpen(false)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Continuar Comprando
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.id}-${item.size}-${item.color}`}
                  className="flex gap-4 p-3 rounded-lg bg-background/50 border border-border/30 animate-fade-in"
                >
                  <div className="w-20 h-20 rounded-md overflow-hidden bg-charcoal-light flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif text-lg text-foreground truncate">
                      {item.name}
                    </h4>
                    <div className="flex gap-2 text-sm text-muted-foreground mt-1">
                      {item.size && <span>Talla: {item.size}</span>}
                      {item.color && <span>• Color: {item.color}</span>}
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2 bg-background rounded-md border border-border/50">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1, item.size, item.color)}
                          className="p-1.5 hover:text-primary transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1, item.size, item.color)}
                          className="p-1.5 hover:text-primary transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <span className="font-medium text-foreground">
                        ${(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.id, item.size, item.color)}
                    className="text-muted-foreground hover:text-destructive transition-colors self-start p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t border-border/50 pt-4 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Subtotal</span>
                  <span>${totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Envío</span>
                  <span>Calculado al pagar</span>
                </div>
                <Separator className="bg-border/50" />
                <div className="flex justify-between text-lg font-medium text-foreground">
                  <span>Total</span>
                  <span className="text-primary">${totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <SheetFooter className="flex-col gap-2">
                <Button
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-6"
                  onClick={() => {
                    setIsOpen(false);
                    window.location.href = "/checkout";
                  }}
                >
                  Proceder al Pago
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  className="w-full border-border/50 text-muted-foreground hover:text-foreground"
                >
                  Continuar Comprando
                </Button>
              </SheetFooter>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
