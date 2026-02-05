import { useState } from "react";
import { Link } from "react-router-dom";
import {
    Package,
    Search,
    Truck,
    CheckCircle2,
    Clock,
    AlertCircle,
    ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getOrderById } from "@/services/apiService";

const TrackOrder = () => {
    const [orderId, setOrderId] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [order, setOrder] = useState<any>(null);

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!orderId || !email) {
            toast({
                title: "Campos requeridos",
                description: "Por favor, ingresa el ID del pedido y tu correo electrónico.",
                variant: "destructive",
            });
            return;
        }

        setLoading(true);
        setOrder(null);
        try {
            const data = await getOrderById(orderId, email);
            setOrder(data);
        } catch (error: any) {
            console.error("Error tracking order:", error);
            toast({
                title: "Error",
                description: error.response?.data?.detail || "No se pudo encontrar el pedido. Verifica los datos.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const getStatusConfig = (status: string) => {
        switch (status.toLowerCase()) {
            case "pending":
                return {
                    icon: <Clock className="text-amber-500" />,
                    text: "Pendiente",
                    desc: "Tu pedido ha sido recibido y está a la espera de confirmación.",
                    color: "bg-amber-500",
                    step: 1
                };
            case "paid":
                return {
                    icon: <CheckCircle2 className="text-blue-500" />,
                    text: "Pagado",
                    desc: "El pago ha sido confirmado. Estamos preparando tu envío.",
                    color: "bg-blue-500",
                    step: 2
                };
            case "shipped":
                return {
                    icon: <Truck className="text-purple-500" />,
                    text: "Enviado",
                    desc: "Tu pedido ya está en camino a tu dirección.",
                    color: "bg-purple-500",
                    step: 3
                };
            case "delivered":
                return {
                    icon: <CheckCircle2 className="text-green-500" />,
                    text: "Entregado",
                    desc: "El pedido ha sido entregado exitosamente.",
                    color: "bg-green-500",
                    step: 4
                };
            default:
                return {
                    icon: <AlertCircle className="text-muted-foreground" />,
                    text: status,
                    desc: "Estado desconocido.",
                    color: "bg-gray-500",
                    step: 0
                };
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="pt-24 pb-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <h1 className="font-serif text-4xl text-center text-foreground mb-4">
                            Rastrear mi Pedido
                        </h1>
                        <p className="text-center text-muted-foreground mb-12 max-w-md mx-auto">
                            Ingresa los detalles de tu compra para conocer el estado actual de tu envío.
                        </p>

                        <div className="bg-card border border-border rounded-xl p-8 shadow-sm mb-12">
                            <form onSubmit={handleTrack} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                                <div className="space-y-2 md:col-span-1">
                                    <Label htmlFor="orderId">ID del Pedido</Label>
                                    <Input
                                        id="orderId"
                                        type="text"
                                        placeholder="Ej: 123"
                                        value={orderId}
                                        onChange={(e) => setOrderId(e.target.value)}
                                        className="bg-background"
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-1">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="tu@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="bg-background"
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-10"
                                >
                                    {loading ? "Buscando..." : (
                                        <>
                                            <Search size={18} className="mr-2" />
                                            Buscar
                                        </>
                                    )}
                                </Button>
                            </form>
                        </div>

                        {order && (
                            <div className="space-y-8 animate-fadeIn">
                                {/* Order Summary Header */}
                                <div className="flex flex-wrap justify-between items-center gap-4 bg-primary/5 border border-primary/10 rounded-lg p-6">
                                    <div>
                                        <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">
                                            Pedido #{order.id}
                                        </p>
                                        <p className="text-lg font-medium">
                                            Realizado el: <span className="text-foreground">{order.created_at}</span>
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">
                                            Total
                                        </p>
                                        <p className="text-2xl font-serif text-primary">
                                            ${order.total_amount.toLocaleString('es-CO')}
                                        </p>
                                    </div>
                                </div>

                                {/* Tracking Stepper */}
                                <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
                                    <div className="flex items-center gap-4 mb-8 pb-6 border-b border-border">
                                        <div className="p-3 rounded-full bg-primary/10">
                                            {getStatusConfig(order.status).icon}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-medium">Estado: {getStatusConfig(order.status).text}</h3>
                                            <p className="text-muted-foreground">{getStatusConfig(order.status).desc}</p>
                                        </div>
                                    </div>

                                    <div className="relative mt-8">
                                        <div className="absolute top-5 left-0 w-full h-0.5 bg-border -z-10" />
                                        <div
                                            className="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-500 -z-10"
                                            style={{ width: `${((getStatusConfig(order.status).step - 1) / 3) * 100}%` }}
                                        />

                                        <div className="flex justify-between relative">
                                            {[
                                                { label: "Pendiente", icon: <Clock size={20} />, step: 1 },
                                                { label: "Pagado", icon: <CheckCircle2 size={20} />, step: 2 },
                                                { label: "Enviado", icon: <Truck size={20} />, step: 3 },
                                                { label: "Entregado", icon: <CheckCircle2 size={20} />, step: 4 },
                                            ].map((s) => {
                                                const currentStep = getStatusConfig(order.status).step;
                                                const isCompleted = currentStep >= s.step;
                                                const isActive = currentStep === s.step;

                                                return (
                                                    <div key={s.label} className="flex flex-col items-center">
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 border-2 transition-colors ${isCompleted ? 'bg-primary border-primary text-primary-foreground shadow-md' : 'bg-background border-border text-muted-foreground'
                                                            } ${isActive ? 'ring-4 ring-primary/20 scale-110' : ''}`}>
                                                            {s.icon}
                                                        </div>
                                                        <span className={`text-xs font-medium ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                                                            {s.label}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {/* Items and Shipping Details */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                                        <h3 className="font-medium text-lg mb-4 flex items-center gap-2">
                                            <Package size={20} className="text-primary" />
                                            Productos
                                        </h3>
                                        <div className="space-y-4">
                                            {order.items.map((item: any, idx: number) => (
                                                <div key={idx} className="flex gap-4 items-center py-2 border-b border-border last:border-0">
                                                    <div className="w-12 h-12 bg-muted rounded flex items-center justify-center font-medium">
                                                        {item.quantity}x
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-medium">Producto #{item.product_id}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            Talla: {item.size} | Color: {item.color}
                                                        </p>
                                                    </div>
                                                    <p className="font-medium">
                                                        ${(item.price * item.quantity).toLocaleString('es-CO')}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                                        <h3 className="font-medium text-lg mb-4 flex items-center gap-2">
                                            <Truck size={20} className="text-primary" />
                                            Información de Envío
                                        </h3>
                                        <div className="space-y-3 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Cliente:</span>
                                                <span className="font-medium">{order.customer_name}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Email:</span>
                                                <span className="font-medium">{order.customer_email}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Dirección:</span>
                                                <span className="font-medium text-right">{order.address}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Ciudad:</span>
                                                <span className="font-medium">{order.city}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Método de Pago:</span>
                                                <span className="font-medium uppercase">{order.payment_method}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {!order && !loading && (
                            <div className="text-center mt-20 opacity-50">
                                <Package size={80} className="mx-auto mb-4 text-muted-foreground/30" />
                                <p>Ingresa tus datos para ver la información del pedido</p>
                            </div>
                        )}

                        {/* Help Section */}
                        <div className="mt-16 bg-accent/50 rounded-xl p-8 border border-border">
                            <div className="flex flex-col md:flex-row items-center gap-6">
                                <div className="flex-1 text-center md:text-left">
                                    <h3 className="text-xl font-medium mb-2">¿Necesitas ayuda con tu pedido?</h3>
                                    <p className="text-muted-foreground">
                                        Si tienes problemas para encontrar tu pedido o tienes dudas sobre el envío, contáctanos.
                                    </p>
                                </div>
                                <div className="flex flex-wrap justify-center gap-4">
                                    <Button variant="outline" className="gap-2">
                                        WhatsApp
                                    </Button>
                                    <Button variant="outline" className="gap-2">
                                        Enviar Email
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default TrackOrder;
