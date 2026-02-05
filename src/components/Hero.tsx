import heroImage from "@/assets/hero-lingerie.jpg";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Luxury lingerie collection"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
      </div>

      {/* Content */}
      <div className="container relative z-10 px-4 lg:px-8 pt-20">
        <div className="max-w-2xl animate-slide-up">
          <span className="inline-block text-gold text-sm tracking-[0.3em] uppercase mb-4 font-medium">
            Nueva Colección 2025
          </span>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-light leading-tight mb-6">
            Elegancia que{" "}
            <span className="italic text-primary">seduce</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg mb-8 leading-relaxed">
            Descubre nuestra colección exclusiva de lencería fina, diseñada para realzar 
            tu belleza natural con la más alta calidad y sofisticación.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="bg-primary hover:bg-rose-dark text-primary-foreground px-8 group">
              Explorar Colección
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="border-foreground/30 text-foreground hover:bg-foreground/10 hover:border-foreground/50">
              Ver Novedades
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative element */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-px h-16 bg-gradient-to-b from-transparent via-primary to-transparent" />
      </div>
    </section>
  );
};

export default Hero;
