import { Heart, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/contexts/WishlistContext";

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  isNew?: boolean;
  isSale?: boolean;
}

const ProductCard = ({
  id,
  name,
  price,
  originalPrice,
  image,
  isNew,
  isSale,
}: ProductCardProps) => {
  const { isInWishlist, toggleItem } = useWishlist();
  const isLiked = isInWishlist(id);

  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem({ id, name, price, originalPrice, image });
  };

  return (
    <Link to={`/producto/${id}`} className="group relative block">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden rounded-lg bg-charcoal-light mb-4">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-background/40 backdrop-blur-[2px] transition-opacity duration-300 opacity-0 group-hover:opacity-100" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isNew && (
            <span className="px-3 py-1 bg-gold text-accent-foreground text-xs font-medium tracking-wide rounded-sm">
              NUEVO
            </span>
          )}
          {isSale && discount > 0 && (
            <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium tracking-wide rounded-sm">
              -{discount}%
            </span>
          )}
        </div>

        {/* Like Button */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full bg-background/80 flex items-center justify-center transition-all duration-300 hover:bg-primary hover:text-primary-foreground ${isLiked ? "text-primary" : ""
            }`}
        >
          <Heart size={18} className={isLiked ? "fill-primary" : ""} />
        </button>

        {/* Action Buttons */}
        <div className="absolute bottom-4 left-4 right-4 flex gap-2 transition-all duration-300 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0">
          <Button className="flex-1 bg-foreground text-background hover:bg-primary hover:text-primary-foreground text-sm">
            <Eye size={16} className="mr-2" />
            Ver Detalles
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-1">
        <h3 className="font-serif text-lg text-foreground group-hover:text-primary transition-colors duration-300">
          {name}
        </h3>
        <div className="flex items-center gap-3">
          <span className="text-lg font-medium text-foreground">
            ${price.toLocaleString()}
          </span>
          {originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ${originalPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
