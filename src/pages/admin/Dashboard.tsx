import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
    TrendingUp,
    ShoppingBag,
    Package,
    Users,
    ArrowUpRight,
    ArrowDownRight,
    DollarSign
} from "lucide-react";
import { getAdminStats } from "@/services/apiService";

const AdminDashboard = () => {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getAdminStats();
                setStats(data);
            } catch (error) {
                console.error("Error fetching admin stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const cardStats = [
        {
            label: "Ventas Totales",
            value: stats ? `$${stats.revenue.toLocaleString('es-CO')}` : "$0",
            icon: <DollarSign size={24} />,
            change: stats?.revenue > 0 ? "+100%" : "0%",
            isUp: true,
            color: "bg-blue-500/10 text-blue-500"
        },
        {
            label: "Pedidos",
            value: stats ? stats.orders_count : "0",
            icon: <ShoppingBag size={24} />,
            change: stats?.orders_count > 0 ? "+100%" : "0%",
            isUp: true,
            color: "bg-green-500/10 text-green-500"
        },
        {
            label: "Productos",
            value: stats ? stats.products_count : "0",
            icon: <Package size={24} />,
            change: "0%",
            isUp: true,
            color: "bg-purple-500/10 text-purple-500"
        },
        {
            label: "Visitantes",
            value: stats ? stats.visitors_count.toLocaleString() : "0",
            icon: <Users size={24} />,
            change: stats?.visitors_count > 0 ? "+100%" : "0%",
            isUp: true,
            color: "bg-amber-500/10 text-amber-500"
        },
    ];

    const maxMonthlyRevenue = stats?.sales_activity ? Math.max(...stats.sales_activity, 1) : 1;

    return (
        <AdminLayout>
            <div className="space-y-8 animate-fadeIn">
                <div>
                    <h1 className="text-3xl font-serif font-semibold text-foreground">Dashboard</h1>
                    <p className="text-muted-foreground mt-1">Bienvenido de nuevo al panel de administración.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {cardStats.map((stat, idx) => (
                        <div key={idx} className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-lg ${stat.color}`}>
                                    {stat.icon}
                                </div>
                                <div className={`flex items-center text-xs font-medium ${stat.isUp ? 'text-green-500' : 'text-red-500'}`}>
                                    {stat.change}
                                    {stat.isUp ? <ArrowUpRight size={14} className="ml-1" /> : <ArrowDownRight size={14} className="ml-1" />}
                                </div>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                                <h3 className="text-2xl font-bold mt-1">{loading ? "..." : stat.value}</h3>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Sales Activity - Real Data Chart */}
                    <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-medium">Actividad de Ventas (Año Actual)</h2>
                            <button className="text-xs text-primary font-medium hover:underline">Ver reporte completo</button>
                        </div>
                        <div className="h-[300px] flex items-end justify-between gap-2 px-2">
                            {(stats?.sales_activity || Array(12).fill(0)).map((revenue: number, i: number) => (
                                <div key={i} className="flex-1 space-y-2 group">
                                    <div
                                        className="bg-primary/20 group-hover:bg-primary transition-all duration-300 rounded-t-sm"
                                        style={{ height: `${(revenue / maxMonthlyRevenue) * 100}%`, minHeight: revenue > 0 ? '4px' : '0' }}
                                        title={`$${revenue.toLocaleString('es-CO')}`}
                                    />
                                    <p className="text-[10px] text-center text-muted-foreground uppercase">{['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Orders - Real Data */}
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                        <h2 className="text-xl font-medium mb-6">Pedidos Recientes</h2>
                        <div className="space-y-6">
                            {stats?.recent_orders && stats.recent_orders.length > 0 ? (
                                stats.recent_orders.map((order: any, i: number) => (
                                    <div key={order.id} className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-medium text-xs">
                                            #{order.id}
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <p className="text-sm font-medium truncate">{order.customer_name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-primary">${order.total_amount.toLocaleString('es-CO')}</p>
                                            <p className={`text-[10px] uppercase font-bold ${order.status === 'paid' ? 'text-green-500' :
                                                order.status === 'delivered' ? 'text-blue-500' : 'text-amber-500'
                                                }`}>
                                                {order.status === 'paid' ? 'Pagado' :
                                                    order.status === 'delivered' ? 'Entregado' : 'Pendiente'}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-muted-foreground py-10 italic">No hay pedidos recientes.</p>
                            )}
                        </div>
                        <a href="/admin/orders" className="block w-full mt-8 py-2 text-sm text-center font-medium border border-border rounded-lg hover:bg-muted transition-colors">
                            Ver todos los pedidos
                        </a>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
