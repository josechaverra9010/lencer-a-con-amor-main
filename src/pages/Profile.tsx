import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Heart, Package, LogOut, ArrowLeft, Edit2, Check, Calendar, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { toast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getUserOrders } from "@/services/apiService";
import { Separator } from "@/components/ui/separator";

const Profile = () => {
  const { user, logout, updateProfile, isAuthenticated } = useAuth();
  const { items: wishlistItems } = useWishlist();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || "");
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchOrders();
    }
  }, [isAuthenticated, user?.id]);

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const data = await getUserOrders(user!.id);
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  if (!isAuthenticated) {
    navigate("/auth");
    return null;
  }

  const handleLogout = () => {
    logout();
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente.",
    });
    navigate("/");
  };

  const handleSaveName = () => {
    if (editName.trim()) {
      updateProfile({ name: editName.trim() });
      setIsEditing(false);
      toast({
        title: "Perfil actualizado",
        description: "Tu nombre ha sido actualizado correctamente.",
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
            <h1 className="font-serif text-4xl text-foreground mb-8">Mi Cuenta</h1>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Profile Info & Orders */}
              <div className="md:col-span-2 space-y-8">
                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-serif text-2xl text-foreground">Información Personal</h2>
                    {!isEditing && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditName(user?.name || "");
                          setIsEditing(true);
                        }}
                        className="text-muted-foreground hover:text-primary"
                      >
                        <Edit2 size={16} className="mr-2" />
                        Editar
                      </Button>
                    )}
                  </div>

                  <div className="flex items-center gap-6 mb-6">
                    <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                      <User size={32} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <Input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="bg-background border-border"
                          />
                          <Button
                            size="icon"
                            onClick={handleSaveName}
                            className="bg-primary hover:bg-primary/90"
                          >
                            <Check size={16} />
                          </Button>
                        </div>
                      ) : (
                        <h3 className="text-xl font-medium text-foreground">{user?.name}</h3>
                      )}
                      <p className="text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border/50">
                    <p className="text-sm text-muted-foreground">
                      Miembro desde: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Orders Section */}
                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Package className="text-primary" size={24} />
                    <h2 className="font-serif text-2xl text-foreground">Mis Pedidos</h2>
                  </div>

                  {loadingOrders ? (
                    <div className="flex justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : orders.length > 0 ? (
                    <div className="space-y-6">
                      {orders.map((order) => (
                        <div key={order.id} className="border border-border/50 rounded-lg p-4 bg-background/30">
                          <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Pedido #{order.id}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Calendar size={14} className="text-muted-foreground" />
                                <span className="text-sm">{order.created_at}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-primary">${order.total_amount.toLocaleString()}</p>
                              <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full mt-1 inline-block ${order.status === 'delivered' ? 'bg-green-500/10 text-green-500' :
                                order.status === 'paid' ? 'bg-blue-500/10 text-blue-500' :
                                  'bg-amber-500/10 text-amber-500'
                                }`}>
                                {order.status === 'pending' ? 'Pendiente' :
                                  order.status === 'paid' ? 'Pagado' :
                                    order.status === 'delivered' ? 'Entregado' : order.status}
                              </span>
                            </div>
                          </div>

                          <Separator className="my-3 bg-border/30" />

                          <div className="space-y-2">
                            {order.items?.map((item: any) => (
                              <div key={item.id} className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                  {item.quantity}x {item.product?.name || "Producto"} {item.size && `(${item.size})`}
                                </span>
                                <span>${(item.price * item.quantity).toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <ShoppingBag size={48} className="mx-auto text-muted-foreground/20 mb-4" />
                      <p className="text-muted-foreground">No tienes pedidos todavía.</p>
                      <Button asChild variant="link" className="text-primary mt-2">
                        <Link to="/productos">Ir a la tienda</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions & Wishlist */}
              <div className="space-y-8">
                {/* Wishlist Preview */}
                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-serif text-xl text-foreground">Lista de Deseos</h2>
                    <Link to="/wishlist" className="text-primary hover:underline text-xs">
                      Ver todo
                    </Link>
                  </div>

                  {wishlistItems.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3">
                      {wishlistItems.slice(0, 4).map((item) => (
                        <Link
                          key={item.id}
                          to={`/producto/${item.id}`}
                          className="aspect-square rounded-md overflow-hidden bg-charcoal-light"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                          />
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8 text-sm">
                      Lista vacía
                    </p>
                  )}
                </div>

                <div className="space-y-4">
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <LogOut size={18} className="mr-2" />
                    Cerrar Sesión
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

export default Profile;
