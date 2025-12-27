import { useState } from 'react';
import { Plus, Minus, ShoppingCart, Star } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Product } from '@/data/products';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
}

const flavorGradients: Record<string, string> = {
  mint: 'from-emerald-50 to-teal-50 border-emerald-200',
  pink: 'from-pink-50 to-rose-50 border-pink-200',
  red: 'from-red-50 to-orange-50 border-red-200',
  teal: 'from-cyan-50 to-sky-50 border-cyan-200',
  rust: 'from-orange-50 to-amber-50 border-orange-200',
  gold: 'from-yellow-50 to-amber-50 border-yellow-200',
};

const flavorBadgeColors: Record<string, string> = {
  mint: 'bg-emerald-100 text-emerald-700',
  pink: 'bg-pink-100 text-pink-700',
  red: 'bg-red-100 text-red-700',
  teal: 'bg-cyan-100 text-cyan-700',
  rust: 'bg-orange-100 text-orange-700',
  gold: 'bg-yellow-100 text-yellow-700',
};

const flavorButtonColors: Record<string, string> = {
  mint: 'bg-emerald-500 hover:bg-emerald-600',
  pink: 'bg-pink-500 hover:bg-pink-600',
  red: 'bg-red-500 hover:bg-red-600',
  teal: 'bg-cyan-600 hover:bg-cyan-700',
  rust: 'bg-orange-600 hover:bg-orange-700',
  gold: 'bg-yellow-500 hover:bg-yellow-600',
};

export const ProductCard = ({ product }: ProductCardProps) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        flavor: product.flavor,
        price: product.price,
        image: product.image,
        flavorColor: product.flavorColor,
      });
    }
    toast({
      title: "Added to cart! 🎉",
      description: `${quantity}x ${product.flavor} makhana`,
    });
    setQuantity(1);
  };

  return (
    <div className={`group relative bg-gradient-to-br ${flavorGradients[product.flavorColor]} rounded-3xl border overflow-hidden product-card-hover shadow-soft`}>
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {product.isBestseller && (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
            <Star className="w-3 h-3 fill-current" /> Bestseller
          </span>
        )}
        {product.isNew && (
          <span className="px-3 py-1 bg-accent text-accent-foreground text-xs font-semibold rounded-full">
            New
          </span>
        )}
      </div>

      {/* Protein Badge */}
      <div className="absolute top-3 right-3 z-10">
        <span className={`px-2 py-1 ${flavorBadgeColors[product.flavorColor]} text-xs font-bold rounded-full`}>
          {product.protein} Protein
        </span>
      </div>

      {/* Image */}
      <div className="relative aspect-square p-6 flex items-center justify-center">
        <img
          src={product.image}
          alt={product.name}
          className="w-32 h-32 md:w-40 md:h-40 object-contain transition-transform duration-300 group-hover:scale-110"
        />
        {/* Floating decorations */}
        <div className="absolute bottom-4 right-4 text-2xl opacity-40 animate-float-slow">✨</div>
      </div>

      {/* Content */}
      <div className="p-4 pt-0 space-y-3">
        <div>
          <h3 className="font-display font-bold text-lg text-foreground leading-tight">
            {product.flavor}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="font-display font-extrabold text-xl text-foreground">
            ₹{product.price}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ₹{product.originalPrice}
            </span>
          )}
        </div>

        {/* Quantity & Add to Cart */}
        <div className="flex items-center gap-2">
          {/* Quantity Selector */}
          <div className="flex items-center bg-secondary rounded-full">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-semibold text-sm">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart */}
          <Button
            onClick={handleAddToCart}
            className={`flex-1 rounded-full font-semibold text-white ${flavorButtonColors[product.flavorColor]}`}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};
