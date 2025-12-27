import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { products } from '@/data/products';
import { ProductCard } from './ProductCard';
import { Button } from '@/components/ui/button';

export const FeaturedProducts = () => {
  const featured = products.filter(p => p.isBestseller || p.isNew).slice(0, 6);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-sm font-medium text-primary uppercase tracking-wider">
              Fan Favorites
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-extrabold text-foreground mt-2">
              Our Bestsellers
            </h2>
            <p className="text-muted-foreground mt-2 max-w-md">
              Discover the flavors everyone's talking about
            </p>
          </div>
          
          {/* Navigation Arrows */}
          <div className="hidden md:flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => scroll('left')}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => scroll('right')}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Horizontal Slider */}
        <div 
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 scroll-snap-x scrollbar-hide -mx-4 px-4"
        >
          {featured.map((product, index) => (
            <div
              key={product.id}
              className="min-w-[180px] md:min-w-[200px] flex-shrink-0 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
