import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import { products } from '@/data/products';
import { ProductCard } from './ProductCard';
import { Button } from '@/components/ui/button';

export const FeaturedProducts = () => {
  const featured = products.filter(p => p.isBestseller || p.isNew).slice(0, 6);
  
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: false,
    skipSnaps: false,
    dragFree: true,
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollSnaps = emblaApi?.scrollSnapList() || [];

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
              className="rounded-full transition-opacity"
              onClick={scrollPrev}
              disabled={!canScrollPrev}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full transition-opacity"
              onClick={scrollNext}
              disabled={!canScrollNext}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Embla Carousel */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4">
            {featured.map((product, index) => (
              <div
                key={product.id}
                className="flex-[0_0_calc(50%-8px)] sm:flex-[0_0_calc(33.333%-11px)] lg:flex-[0_0_calc(25%-12px)] min-w-0 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => emblaApi?.scrollTo(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === selectedIndex 
                  ? 'bg-primary w-6' 
                  : 'bg-primary/30 hover:bg-primary/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
