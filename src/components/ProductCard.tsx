import { useState } from 'react';
import { Plus, Minus, ShoppingCart, Star } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Product } from '@/data/products';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
}

// Colors extracted from actual Aurabites packaging
const flavorGradients: Record<string, string> = {
  'cream-onion': 'gradient-cream-onion border-[hsl(195_55%_75%)]',
  himalayan: 'gradient-himalayan border-[hsl(340_35%_80%)]',
  'peri-peri': 'gradient-peri-peri border-[hsl(35_65%_80%)]',
  mint: 'gradient-mint border-[hsl(95_45%_70%)]',
  tandoori: 'gradient-tandoori border-[hsl(15_55%_70%)]',
  gold: 'bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200',
};

const flavorBadgeColors: Record<string, string> = {
  'cream-onion': 'bg-[hsl(195_55%_85%)] text-[hsl(195_55%_30%)]',
  himalayan: 'bg-[hsl(340_35%_88%)] text-[hsl(340_35%_30%)]',
  'peri-peri': 'bg-[hsl(35_65%_85%)] text-[hsl(35_65%_30%)]',
  mint: 'bg-[hsl(95_45%_85%)] text-[hsl(95_45%_25%)]',
  tandoori: 'bg-[hsl(15_55%_85%)] text-[hsl(15_55%_25%)]',
  gold: 'bg-amber-100 text-amber-700',
};

const flavorButtonColors: Record<string, string> = {
  'cream-onion': 'bg-[hsl(195_55%_45%)] hover:bg-[hsl(195_55%_40%)]',
  himalayan: 'bg-[hsl(340_35%_55%)] hover:bg-[hsl(340_35%_50%)]',
  'peri-peri': 'bg-[hsl(25_65%_45%)] hover:bg-[hsl(25_65%_40%)]',
  mint: 'bg-[hsl(95_45%_40%)] hover:bg-[hsl(95_45%_35%)]',
  tandoori: 'bg-[hsl(15_55%_35%)] hover:bg-[hsl(15_55%_30%)]',
  gold: 'bg-amber-500 hover:bg-amber-600',
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
    <div className={`group relative ${flavorGradients[product.flavorColor]} rounded-3xl border overflow-hidden product-card-hover shadow-soft`}>
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
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        {/* Floating decorations */}
        <div className="absolute bottom-3 right-3 text-xl opacity-40 animate-float-slow">✨</div>
      </div>

      {/* Content */}
      <div className="p-4 pt-4 space-y-3">
        <div>
          <h3 className="font-display font-bold text-xl text-foreground leading-tight">
            {product.flavor}
          </h3>
          <p className="text-base text-muted-foreground mt-2 line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="font-display font-extrabold text-2xl text-foreground">
            ₹{product.price}
          </span>
          {product.originalPrice && (
            <span className="text-base text-muted-foreground line-through">
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
