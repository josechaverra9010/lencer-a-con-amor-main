import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    Users,
    Settings,
    LogOut,
    ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
    children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
    const location = useLocation();

    const menuItems = [
        { name: "Dashboard", href: "/admin", icon: <LayoutDashboard size={20} /> },
        { name: "Productos", href: "/admin/productos", icon: <Package size={20} /> },
        { name: "Pedidos", href: "/admin/pedidos", icon: <ShoppingBag size={20} /> },
        { name: "Usuarios", href: "/admin/usuarios", icon: <Users size={20} /> },
        { name: "Configuración", href: "#", icon: <Settings size={20} /> },
    ];

    return (
        <div className="flex min-h-screen bg-muted/30">
            {/* Sidebar */}
            <aside className="w-64 bg-card border-r border-border flex flex-col sticky top-0 h-screen">
                <div className="p-6 border-b border-border">
                    <Link to="/" className="font-serif text-2xl font-semibold flex items-center gap-2">
                        <span className="text-primary tracking-tighter">SQ</span>
                        <span className="text-sm uppercase tracking-widest font-sans font-normal text-muted-foreground">Admin</span>
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={cn(
                                    "flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all group",
                                    isActive
                                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    {item.icon}
                                    {item.name}
                                </div>
                                {isActive && <ChevronRight size={14} />}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-border mt-auto">
                    <Link
                        to="/"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                    >
                        <LogOut size={20} />
                        Cerrar Admin
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-auto">
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;
