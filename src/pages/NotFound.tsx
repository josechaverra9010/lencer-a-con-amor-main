import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, Search } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 flex items-center justify-center pt-24 pb-20 px-4">
        <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="relative">
            <h1 className="text-9xl font-serif font-bold text-primary/10 select-none">404</h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <h2 className="text-3xl font-serif font-medium text-foreground">Página no encontrada</h2>
            </div>
          </div>
          
          <div className="space-y-3">
            <p className="text-muted-foreground text-lg">
              Lo sentimos, la página que buscas no existe o ha sido movida.
            </p>
            <p className="text-sm text-muted-foreground/60 italic">
              Ruta intentada: {location.pathname}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button asChild variant="default" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
              <Link to="/">
                <Home size={18} />
                Ir al Inicio
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary/5 gap-2">
              <Link to="/productos">
                <Search size={18} />
                Ver Productos
              </Link>
            </Button>
          </div>

          <div className="pt-8">
            <Link 
              to="javascript:history.back()" 
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              onClick={(e) => {
                e.preventDefault();
                window.history.back();
              }}
            >
              <ArrowLeft size={16} />
              Volver a la página anterior
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;
