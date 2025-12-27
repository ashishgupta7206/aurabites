import { ShoppingBag, ChevronUp } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';

export const CartBar = () => {
  const { totalItems, totalPrice, setIsCartOpen } = useCart();

  if (totalItems === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-4 md:hidden animate-slide-up">
      <div 
        onClick={() => setIsCartOpen(true)}
        className="bg-primary text-primary-foreground rounded-2xl p-4 shadow-lift flex items-center justify-between cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <ShoppingBag className="w-6 h-6" />
            <span className="absolute -top-2 -right-2 bg-background text-foreground text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {totalItems}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium opacity-90">{totalItems} items</p>
            <p className="font-bold">₹{totalPrice}</p>
          </div>
        </div>
        <Button variant="secondary" size="sm" className="rounded-full font-semibold">
          View Cart
          <ChevronUp className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};
