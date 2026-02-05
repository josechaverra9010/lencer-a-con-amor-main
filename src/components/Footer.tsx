import { Instagram, Facebook, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const footerLinks = {
    tienda: [
      { name: "Nuevos Llegados", href: "#" },
      { name: "Más Vendidos", href: "#" },
      { name: "Ofertas", href: "#" },
      { name: "Conjuntos", href: "#" },
    ],
    ayuda: [
      { name: "Guía de Tallas", href: "#" },
      { name: "Envíos", href: "#" },
      { name: "Devoluciones", href: "#" },
      { name: "Contacto", href: "#" },
    ],
    empresa: [
      { name: "Sobre Nosotros", href: "#" },
      { name: "Sostenibilidad", href: "#" },
      { name: "Carreras", href: "#" },
      { name: "Prensa", href: "#" },
    ],
  };

  return (
    <footer className="bg-charcoal border-t border-border">
      <div className="container px-4 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          <div className="col-span-2">
            <h2 className="font-serif text-3xl font-semibold mb-4">
              <span className="text-primary">S</span>exshop <span className="text-primary">Q</span>uibdo
            </h2>
            <p className="text-muted-foreground text-sm max-w-xs mb-6 leading-relaxed">
              Lencería de lujo diseñada para la mujer moderna.
              Elegancia, comodidad y sofisticación en cada pieza.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                <Instagram size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                <Facebook size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-medium text-foreground mb-4 tracking-wide uppercase text-sm">
              Tienda
            </h3>
            <ul className="space-y-3">
              {footerLinks.tienda.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-foreground mb-4 tracking-wide uppercase text-sm">
              Ayuda
            </h3>
            <ul className="space-y-3">
              {footerLinks.ayuda.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-foreground mb-4 tracking-wide uppercase text-sm">
              Empresa
            </h3>
            <ul className="space-y-3">
              {footerLinks.empresa.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col lg:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © 2025 Sexshop Quibdo. Todos los derechos reservados.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Términos y Condiciones
            </a>
            <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Política de Privacidad
            </a>
            <Link to="/rastrear-pedido" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Rastrear Pedido
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
