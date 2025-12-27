import { useState } from 'react';
import { Plus, Minus, ShoppingCart, Star } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Product } from '@/data/products';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

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
  const { items, addToCart, removeFromCart, updateQuantity } = useCart();
  const cartItem = items.find(item => item.id === product.id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  const isPredefined = flavorGradients[product.flavorColor];

  // Dynamic Styles if not predefined
  const dynamicCardStyle = !isPredefined ? {
    background: `linear-gradient(135deg, ${product.flavorColor} 0%, #ffffff 100%)`, // Gradient from flavor color to white
    borderColor: product.flavorColor,
  } : {};

  const dynamicBadgeStyle = !isPredefined ? {
    backgroundColor: product.flavorColor,
    color: '#333' // Assuming dark text for light colors, ideally should contrast check
  } : {};

  const dynamicButtonStyle = !isPredefined ? {
    backgroundColor: product.flavorColor,
    color: '#000' // Better contrast usually for buttons with lightish bgs? Or White?
    // Given aurabites design, buttons are usually dark/saturated. 
    // If the API returns light colors like #FFF0CC, white text is bad.
    // But let's assume the API returns a usable main color.
    // For safety, let's use black text for dynamic button if unsure, or white if dark. 
    // Without color manipulation lib, hard to guess. 
    // Let's stick to black text for safety on light/pastel package colors
  } : {};


  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      flavor: product.flavor,
      price: product.price,
      image: product.image,
      flavorColor: product.flavorColor,
      quantity: 1,
    });
    toast({
      title: "Added to cart! 🎉",
      description: `${product.flavor} makhana`,
    });
  };

  const handleIncrement = () => {
    addToCart({
      id: product.id,
      name: product.name,
      flavor: product.flavor,
      price: product.price,
      image: product.image,
      flavorColor: product.flavorColor,
      quantity: 1,
    });
  };

  const handleDecrement = () => {
    if (quantityInCart > 1) {
      updateQuantity(product.id, quantityInCart - 1);
    } else {
      removeFromCart(product.id);
    }
  };

  return (
    <div
      className={`group relative rounded-3xl border overflow-hidden product-card-hover shadow-soft ${isPredefined ? flavorGradients[product.flavorColor] : ''}`}
      style={dynamicCardStyle}
    >
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
        <span
          className={`px-2 py-1 text-xs font-bold rounded-full ${isPredefined ? flavorBadgeColors[product.flavorColor] : ''}`}
          style={dynamicBadgeStyle}
        >
          {product.protein} Protein
        </span>
      </div>

      {/* Image */}
      <Link to={`/product/${product.productId}`}>
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          {/* Floating decorations */}
          <div className="absolute bottom-3 right-3 text-xl opacity-40 animate-float-slow">✨</div>
        </div>
      </Link>


      {/* Content */}
      <div className="p-4 pt-4 space-y-3">
        <Link to={`/product/${product.productId}`}>
          <div>

            <h3 className="font-display font-bold text-xl text-foreground leading-tight">
              {product.name}
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
        </Link>

        {/* Quantity & Add to Cart */}
        <div className="mt-4">
          {quantityInCart === 0 ? (
            <Button
              onClick={handleAddToCart}
              className={`w-full rounded-full font-semibold text-white transition-all duration-300 ${isPredefined ? flavorButtonColors[product.flavorColor] : ''}`}
              style={!isPredefined ? { backgroundColor: product.flavorColor, color: '#000' } : {}}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
          ) : (
            <div className="flex items-center justify-between bg-secondary rounded-full p-1 animate-in fade-in zoom-in duration-200">
              <button
                onClick={handleDecrement}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-background/50 hover:bg-background text-foreground transition-colors shadow-sm"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-display font-bold text-lg w-8 text-center">
                {quantityInCart}
              </span>
              <button
                onClick={handleIncrement}
                className={`w-10 h-10 flex items-center justify-center rounded-full text-white transition-colors shadow-sm ${isPredefined ? flavorButtonColors[product.flavorColor] : ''}`}
                style={!isPredefined ? { backgroundColor: product.flavorColor, color: '#000' } : {}}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div >
  );
};
