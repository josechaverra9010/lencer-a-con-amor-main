import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, CreditCard, Truck, Check, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createOrder, getUserOrders } from "@/services/apiService";

type Step = "shipping" | "payment" | "confirmation";

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>("shipping");
  const [loading, setLoading] = useState(false);
  const [orderNumber] = useState(() => `LR-${Date.now().toString(36).toUpperCase()}`);

  const [shippingData, setShippingData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "Colombia",
  });

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      const loadPreviousData = async () => {
        try {
          const orders = await getUserOrders(user.id);
          if (orders && orders.length > 0) {
            const lastOrder = orders[0];
            setShippingData({
              name: lastOrder.customer_name || user.name || "",
              email: lastOrder.customer_email || user.email || "",
              phone: lastOrder.customer_phone || "",
              address: lastOrder.address || "",
              city: lastOrder.city || "",
              postalCode: lastOrder.postal_code || "",
              country: "Colombia",
            });
            toast({
              title: "Datos autocompletados",
              description: "Hemos rellenado tus datos de envío con la información de tu última compra.",
            });
          }
        } catch (error) {
          console.error("Error loading previous order data:", error);
        }
      };
      loadPreviousData();
    }
  }, [isAuthenticated, user?.id, user?.name, user?.email]);

  const [paymentData, setPaymentData] = useState({
    method: "wompi",
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
  });

  const shippingCost = totalPrice >= 100000 ? 0 : 15000;
  const finalTotal = totalPrice + shippingCost;

  if (items.length === 0 && step !== "confirmation") {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-20 container mx-auto px-4 text-center">
          <Package size={64} className="mx-auto text-muted-foreground/30 mb-4" />
          <h1 className="font-serif text-3xl text-foreground mb-4">Tu carrito está vacío</h1>
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link to="/productos">Ir a la Tienda</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingData.name || !shippingData.email || !shippingData.phone ||
      !shippingData.address || !shippingData.city || !shippingData.postalCode) {
      toast({
        title: "Campos requeridos",
        description: "Por favor, completa todos los campos de envío.",
        variant: "destructive",
      });
      return;
    }
    setStep("payment");
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        customer_name: shippingData.name,
        customer_email: shippingData.email,
        customer_phone: shippingData.phone,
        address: shippingData.address,
        city: shippingData.city,
        postal_code: shippingData.postalCode,
        total_amount: finalTotal + (paymentData.method === "cod" ? 3 : 0),
        payment_method: paymentData.method,
        user_id: isAuthenticated ? user?.id : null,
        items: items.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
          size: item.size,
          color: item.color
        }))
      };

      const order = await createOrder(orderData);

      if (paymentData.method === "wompi") {
        // Wompi Checkout integration
        if (!(window as any).WidgetCheckout) {
          toast({
            title: "Error de conexión",
            description: "No se pudo cargar la pasarela de pago. Por favor, refresca la página.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        const checkout = new (window as any).WidgetCheckout({
          currency: 'COP',
          amountInCents: Math.round(orderData.total_amount * 100),
          reference: `ORD-${order.id}-${Date.now()}`,
          publicKey: 'pub_test_Q5yS9j9psjt7H0vCba8b9R4P3fW26n4O', // Test Key
          redirectUrl: window.location.origin + '/productos' // For testing
        });

        checkout.open((result: any) => {
          const transaction = result.transaction;
          if (transaction.status === 'APPROVED') {
            toast({ title: "Pago aprobado", description: "Tu pedido está en camino." });
            clearCart();
            setStep("confirmation");
          } else {
            toast({ title: "Pago fallido", description: "Hubo un problema con la transacción.", variant: "destructive" });
          }
          setLoading(false);
        });
        return;
      }

      // Cash or other methods
      clearCart();
      setStep("confirmation");
      toast({
        title: "Pedido realizado",
        description: paymentData.method === "cod"
          ? "Recibirás tu pedido y pagarás en efectivo."
          : "Pedido registrado con éxito."
      });

    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "No se pudo procesar el pedido. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (value: string) => {
    return value
      .replace(/\s/g, "")
      .replace(/(\d{4})/g, "$1 ")
      .trim()
      .slice(0, 19);
  };

  const formatExpiry = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "$1/$2")
      .slice(0, 5);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          {step !== "confirmation" && (
            <Link
              to="/productos"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
            >
              <ArrowLeft size={18} />
              <span>Continuar comprando</span>
            </Link>
          )}

          {/* Progress Steps */}
          {step !== "confirmation" && (
            <div className="max-w-2xl mx-auto mb-12">
              <div className="flex items-center justify-center gap-4">
                {["shipping", "payment"].map((s, i) => (
                  <div key={s} className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${step === s
                        ? "bg-primary text-primary-foreground"
                        : i < ["shipping", "payment"].indexOf(step)
                          ? "bg-primary/20 text-primary"
                          : "bg-card text-muted-foreground border border-border"
                        }`}
                    >
                      {i < ["shipping", "payment"].indexOf(step) ? (
                        <Check size={18} />
                      ) : (
                        i + 1
                      )}
                    </div>
                    <span className="ml-2 text-sm font-medium text-foreground hidden sm:inline">
                      {s === "shipping" ? "Envío" : "Pago"}
                    </span>
                    {i < 1 && <div className="w-12 sm:w-24 h-px bg-border mx-4" />}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="max-w-5xl mx-auto grid lg:grid-cols-5 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-3">
              {step === "shipping" && (
                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Truck className="text-primary" size={24} />
                    <h2 className="font-serif text-2xl text-foreground">Datos de Envío</h2>
                  </div>

                  <form onSubmit={handleShippingSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nombre completo</Label>
                        <Input
                          id="name"
                          value={shippingData.name}
                          onChange={(e) => setShippingData({ ...shippingData, name: e.target.value })}
                          required
                          className="bg-background border-border"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={shippingData.email}
                          onChange={(e) => setShippingData({ ...shippingData, email: e.target.value })}
                          required
                          className="bg-background border-border"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={shippingData.phone}
                        onChange={(e) => setShippingData({ ...shippingData, phone: e.target.value })}
                        required
                        placeholder="+34 600 000 000"
                        className="bg-background border-border"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Dirección</Label>
                      <Input
                        id="address"
                        value={shippingData.address}
                        onChange={(e) => setShippingData({ ...shippingData, address: e.target.value })}
                        required
                        placeholder="Calle, número, piso..."
                        className="bg-background border-border"
                      />
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">Ciudad</Label>
                        <Input
                          id="city"
                          value={shippingData.city}
                          onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                          required
                          className="bg-background border-border"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="postalCode">Código Postal</Label>
                        <Input
                          id="postalCode"
                          value={shippingData.postalCode}
                          onChange={(e) => setShippingData({ ...shippingData, postalCode: e.target.value })}
                          required
                          className="bg-background border-border"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">País</Label>
                        <Input
                          id="country"
                          value={shippingData.country}
                          disabled
                          className="bg-background border-border"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 mt-6"
                    >
                      Continuar al Pago
                    </Button>
                  </form>
                </div>
              )}

              {step === "payment" && (
                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <CreditCard className="text-primary" size={24} />
                    <h2 className="font-serif text-2xl text-foreground">Método de Pago</h2>
                  </div>

                  <form onSubmit={handlePaymentSubmit} className="space-y-6">
                    <RadioGroup
                      value={paymentData.method}
                      onValueChange={(value) => setPaymentData({ ...paymentData, method: value })}
                      className="space-y-3"
                    >
                      <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:border-primary transition-colors cursor-pointer">
                        <RadioGroupItem value="wompi" id="wompi" />
                        <Label htmlFor="wompi" className="flex-1 cursor-pointer">
                          <div className="flex items-center gap-3">
                            <CreditCard size={20} className="text-muted-foreground" />
                            <span>Pago Seguro con Wompi (Tarjetas, PSE, Nequi)</span>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:border-primary transition-colors cursor-pointer">
                        <RadioGroupItem value="cod" id="cod" />
                        <Label htmlFor="cod" className="flex-1 cursor-pointer">
                          <div className="flex items-center gap-3">
                            < Truck size={20} className="text-muted-foreground" />
                            <span>Pago en Efectivo (Contra Entrega)</span>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>

                    <div className="flex gap-4 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep("shipping")}
                        className="border-border text-muted-foreground"
                      >
                        Volver
                      </Button>
                      <Button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-6"
                      >
                        {loading ? "Procesando..." : `Confirmar Pedido $${(finalTotal + (paymentData.method === "cod" ? 3 : 0)).toFixed(2)}`}
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {step === "confirmation" && (
                <div className="bg-card border border-border rounded-lg p-8 text-center">
                  <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                    <Check size={40} className="text-primary" />
                  </div>
                  <h2 className="font-serif text-3xl text-foreground mb-2">
                    ¡Pedido Confirmado!
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Gracias por tu compra. Hemos enviado un email de confirmación a{" "}
                    <span className="text-foreground">{shippingData.email}</span>
                  </p>

                  <div className="bg-background/50 rounded-lg p-4 mb-6">
                    <p className="text-sm text-muted-foreground">Número de pedido</p>
                    <p className="text-xl font-medium text-primary">{orderNumber}</p>
                  </div>

                  <div className="text-left bg-background/50 rounded-lg p-4 mb-6">
                    <h3 className="font-medium text-foreground mb-2">Dirección de envío:</h3>
                    <p className="text-muted-foreground">
                      {shippingData.name}<br />
                      {shippingData.address}<br />
                      {shippingData.city}, {shippingData.postalCode}<br />
                      {shippingData.country}
                    </p>
                  </div>

                  <Button
                    asChild
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <Link to="/productos">Continuar Comprando</Link>
                  </Button>
                </div>
              )}
            </div>

            {/* Order Summary */}
            {step !== "confirmation" && (
              <div className="lg:col-span-2">
                <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
                  <h3 className="font-serif text-xl text-foreground mb-4">Resumen del Pedido</h3>

                  <div className="space-y-4 max-h-64 overflow-y-auto">
                    {items.map((item) => (
                      <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-3">
                        <div className="w-16 h-16 rounded-md overflow-hidden bg-charcoal-light flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-foreground truncate">
                            {item.name}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {item.size} • {item.color} • x{item.quantity}
                          </p>
                          <p className="text-sm font-medium text-foreground mt-1">
                            ${(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-4 bg-border/50" />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span>${totalPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Envío</span>
                      <span>{shippingCost === 0 ? "Gratis" : `$${shippingCost.toLocaleString()}`}</span>
                    </div>
                    {paymentData.method === "cod" && (
                      <div className="flex justify-between text-muted-foreground">
                        <span>Contra reembolso</span>
                        <span>$10.000</span>
                      </div>
                    )}
                  </div>

                  <Separator className="my-4 bg-border/50" />

                  <div className="flex justify-between text-lg font-medium text-foreground">
                    <span>Total</span>
                    <span className="text-primary">
                      ${(finalTotal + (paymentData.method === "cod" ? 10000 : 0)).toLocaleString()}
                    </span>
                  </div>

                  {shippingCost === 0 && (
                    <p className="text-xs text-primary mt-2">
                      ¡Envío gratis en pedidos superiores a $100.000!
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
