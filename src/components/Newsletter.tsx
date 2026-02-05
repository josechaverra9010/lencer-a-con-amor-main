import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success("¡Gracias por suscribirte!", {
        description: "Recibirás nuestras ofertas exclusivas pronto.",
      });
      setEmail("");
    }
  };

  return (
    <section className="py-20 lg:py-32 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-charcoal-light via-background to-charcoal-light opacity-50" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />

      <div className="container relative z-10 px-4 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <span className="text-gold text-sm tracking-[0.3em] uppercase mb-4 block">
            Exclusivo
          </span>
          <h2 className="font-serif text-4xl lg:text-5xl font-light mb-6">
            Únete a Nuestra <span className="italic text-primary">Comunidad</span>
          </h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Suscríbete y recibe un 15% de descuento en tu primera compra, 
            además de acceso exclusivo a nuevas colecciones y ofertas especiales.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Tu correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-muted border-border text-foreground placeholder:text-muted-foreground focus:border-primary h-12"
              required
            />
            <Button type="submit" size="lg" className="bg-primary hover:bg-rose-dark text-primary-foreground px-6 group whitespace-nowrap">
              Suscribirse
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>

          <p className="text-xs text-muted-foreground mt-4">
            Al suscribirte aceptas nuestra política de privacidad.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
