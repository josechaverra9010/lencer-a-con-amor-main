import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
    Search,
    Filter,
    MoreVertical,
    Eye,
    Truck,
    CheckCircle2,
    Clock,
    XCircle,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { getAdminOrders, updateOrderStatus } from "@/services/apiService";

const AdminOrders = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const data = await getAdminOrders();
            setOrders(data);
        } catch (error) {
            console.error("Error fetching orders:", error);
            toast({
                title: "Error",
                description: "No se pudieron cargar los pedidos.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusUpdate = async (orderId: number, newStatus: string) => {
        try {
            await updateOrderStatus(orderId, newStatus);
            toast({
                title: "Éxito",
                description: `Estado del pedido #${orderId} actualizado a ${newStatus}.`,
            });
            fetchOrders(); // Refresh table
        } catch (error) {
            console.error("Error updating status:", error);
            toast({
                title: "Error",
                description: "No se pudo actualizar el estado del pedido.",
                variant: "destructive",
            });
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case "pending":
                return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700 uppercase">Pendiente</span>;
            case "paid":
                return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 uppercase">Pagado</span>;
            case "shipped":
                return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-700 uppercase">Enviado</span>;
            case "delivered":
                return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700 uppercase">Entregado</span>;
            case "cancelled":
                return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700 uppercase">Cancelado</span>;
            default:
                return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-700 uppercase">{status}</span>;
        }
    };

    const filteredOrders = orders.filter(order =>
        order.id.toString().includes(searchTerm) ||
        order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer_email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="space-y-8 animate-fadeIn">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-serif font-semibold text-foreground">Pedidos</h1>
                        <p className="text-muted-foreground mt-1">Gestiona las compras de tus clientes.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="gap-2">
                            <Filter size={18} />
                            Filtros
                        </Button>
                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                            Exportar CSV
                        </Button>
                    </div>
                </div>

                {/* Table Controls */}
                <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-border bg-muted/20">
                        <div className="relative max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                            <Input
                                placeholder="Buscar por ID, nombre o email..."
                                className="pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs uppercase bg-muted/50 text-muted-foreground border-b border-border">
                                <tr>
                                    <th className="px-6 py-4 font-semibold italic">ID</th>
                                    <th className="px-6 py-4 font-semibold">Cliente</th>
                                    <th className="px-6 py-4 font-semibold">Fecha</th>
                                    <th className="px-6 py-4 font-semibold">Total</th>
                                    <th className="px-6 py-4 font-semibold">Estado</th>
                                    <th className="px-6 py-4 font-semibold text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground italic">
                                            Cargando pedidos...
                                        </td>
                                    </tr>
                                ) : filteredOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground italic">
                                            No se encontraron pedidos.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="px-6 py-4 font-medium text-foreground">#{order.id}</td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium">{order.customer_name}</div>
                                                <div className="text-xs text-muted-foreground">{order.customer_email}</div>
                                            </td>
                                            <td className="px-6 py-4 text-muted-foreground">
                                                {order.created_at.split(' ')[0]}
                                            </td>
                                            <td className="px-6 py-4 font-medium">
                                                ${order.total_amount.toLocaleString('es-CO')}
                                            </td>
                                            <td className="px-6 py-4">
                                                {getStatusBadge(order.status)}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <MoreVertical size={16} />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-40">
                                                        <DropdownMenuItem className="gap-2">
                                                            <Eye size={14} /> Ver Detalles
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="gap-2 text-blue-600"
                                                            onClick={() => handleStatusUpdate(order.id, 'paid')}
                                                        >
                                                            <CheckCircle2 size={14} /> Marcar Pagado
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="gap-2 text-purple-600"
                                                            onClick={() => handleStatusUpdate(order.id, 'shipped')}
                                                        >
                                                            <Truck size={14} /> Marcar Enviado
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="gap-2 text-green-600"
                                                            onClick={() => handleStatusUpdate(order.id, 'delivered')}
                                                        >
                                                            <CheckCircle2 size={14} /> Marcar Entregado
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="gap-2 text-red-600"
                                                            onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                                                        >
                                                            <XCircle size={14} /> Cancelar
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-4 border-t border-border flex items-center justify-between text-muted-foreground italic">
                        <p>Mostrando {filteredOrders.length} pedidos</p>
                        <div className="flex gap-2">
                            <Button variant="outline" size="icon" disabled className="h-8 w-8">
                                <ChevronLeft size={16} />
                            </Button>
                            <Button variant="outline" size="icon" disabled className="h-8 w-8">
                                <ChevronRight size={16} />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminOrders;
