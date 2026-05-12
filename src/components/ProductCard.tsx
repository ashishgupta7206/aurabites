import type { CSSProperties } from 'react';
import { Plus, Minus, ShoppingCart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { Product } from '@/data/products';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
}

/**
 * Premium product card used on shop/category pages.
 *
 * Visual cues are driven entirely from `product.flavorColor` (a CSS color
 * value coming from packaging) via CSS custom properties, so we don't carry
 * a per-flavour lookup table here. The card is intentionally minimal:
 *
 *   ┌──────────────────────────┐
 *   │ ▶ accent strip (gradient)│
 *   │  large jar image         │
 *   │  flavour pill · protein  │
 *   │  Name                    │
 *   │  short description       │
 *   │  ₹price  ₹mrp̶            │
 *   │  [Add to cart] / qty stepper
 *   └──────────────────────────┘
 */
export const ProductCard = ({ product }: ProductCardProps) => {
  const { items, addToCart, removeFromCart, updateQuantity } = useCart();
  const cartItem = items.find((item) => item.id === product.id);
  const quantityInCart = cartItem?.quantity ?? 0;

  const accent = product.flavorColor || '#5a4836';

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      flavor: product.flavor,
      price: product.price,
      image: product.image,
      flavorColor: accent,
      quantity: 1,
    });
    toast({
      title: 'Added to cart',
      description: `${product.flavor} · ₹${product.price}`,
    });
  };

  const handleIncrement = () => {
    addToCart({
      id: product.id,
      name: product.name,
      flavor: product.flavor,
      price: product.price,
      image: product.image,
      flavorColor: accent,
      quantity: 1,
    });
  };

  const handleDecrement = () => {
    if (quantityInCart > 1) updateQuantity(product.id, quantityInCart - 1);
    else removeFromCart(product.id);
  };

  return (
    <article
      className="ab-product-listing-card group"
      style={{ '--card-accent': accent } as CSSProperties}
    >
      <div className="ab-product-listing-band" aria-hidden="true" />

      {/* Badges row */}
      <div className="ab-product-listing-badges">
        {product.isBestseller && (
          <span className="ab-product-listing-badge ab-product-listing-badge-primary">
            <Star className="h-3 w-3 fill-current" />
            Bestseller
          </span>
        )}
        {product.isNew && (
          <span className="ab-product-listing-badge ab-product-listing-badge-accent">New</span>
        )}
      </div>

      <Link to={`/product/${product.productId}`} className="ab-product-listing-image-link">
        <div className="ab-product-listing-image-wrap">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="ab-product-listing-image"
          />
        </div>
      </Link>

      <div className="ab-product-listing-body">
        <div className="ab-product-listing-meta">
          <span className="ab-product-listing-flavour">{product.flavor}</span>
          <span className="ab-product-listing-protein">{product.protein} protein</span>
        </div>

        <Link to={`/product/${product.productId}`} className="ab-product-listing-name-link">
          <h3 className="ab-product-listing-name">{product.name}</h3>
        </Link>

        <p className="ab-product-listing-desc">{product.description}</p>

        <div className="ab-product-listing-price-row">
          <span className="ab-product-listing-price">₹{product.price}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="ab-product-listing-mrp">₹{product.originalPrice}</span>
          )}
        </div>

        {quantityInCart === 0 ? (
          <Button onClick={handleAddToCart} className="ab-product-listing-add-btn">
            <ShoppingCart className="h-4 w-4" />
            Add to cart
          </Button>
        ) : (
          <div className="ab-product-listing-qty">
            <button onClick={handleDecrement} aria-label="Decrease quantity">
              <Minus className="h-4 w-4" />
            </button>
            <span>{quantityInCart}</span>
            <button onClick={handleIncrement} aria-label="Increase quantity">
              <Plus className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </article>
  );
};
