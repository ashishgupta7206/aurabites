import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import { ProductCard } from './ProductCard';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface ShopProduct {
  productId: number;
  productName: string;
  productSlug: string;
  shortDescription: string;
  longDescription: string;
  mainImage: string;
  status: string;
  categoryId: number;
  categoryName: string;
  productVariantId: number;
  productVariantName: string;
  productVariantSku: string;
  price: number;
  mrp: number;
  discountPercent: number;
  stockQty: number;
  size: string;
  weight: string | null;
  color: string | null;
  barcode: string | null;
  productVariantIsActive: boolean;
  categorySortOrder: number | null;
  productVariantRating: string;
  productVariantMktStatus: string;
  productVariantMktStatusSortOrder: number | null;
  sortOrder: number | null;
  productType: string;
  listOfVariantInCombo: any[];
  images: { id: number; imageUrl: string; sortOrder: number }[];
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: ShopProduct[];
}

export const FeaturedProducts = () => {
  const [featuredProducts, setFeaturedProducts] = useState<ShopProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/products/search`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            // Fetching a reasonable amount to filter client side if needed, or hoping for backend sort
            productType: null,
            pagination: {
              page: 0,
              size: 20
            },
            sorting: [
              { orderBy: "id", order: "desc" }
            ]
          }),
        });

        if (response.ok) {
          const data: ApiResponse = await response.json();
          if (data.success && data.data) {
            // Filter for "BEST_SELLER" or "NEW_LAUNCH" or just take top 6
            // Prioritize ones with statuses
            const featured = data.data.filter(p =>
              p.productVariantMktStatus === 'BEST_SELLER' ||
              p.productVariantMktStatus === 'NEW_LAUNCH' ||
              p.productVariantMktStatus === 'FEATURED'
            ).slice(0, 8);

            // If not enough featured, fill with others
            const finalFeatured = featured.length > 0 ? featured : data.data.slice(0, 8);
            setFeaturedProducts(finalFeatured);
          }
        }
      } catch (error) {
        console.error("Error fetching featured products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, [API_BASE_URL]);


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

  // Map to ProductCard props
  const mapToProductCardProps = (sp: ShopProduct) => {
    return {
      id: String(sp.productVariantId),
      productId: sp.productId,
      name: sp.productVariantName,
      price: sp.price,
      originalPrice: sp.mrp,
      image: sp.images[0]?.imageUrl || sp.mainImage,
      flavor: sp.productName.replace('AURA BITES', '').replace('Makhana', '').trim(),
      flavorColor: sp.color || "#FFF",
      categoryId: String(sp.categoryId),
      description: sp.shortDescription,
      isBestseller: sp.productVariantMktStatus === 'BEST_SELLER',
      isNew: sp.productVariantMktStatus === 'NEW_LAUNCH',
      protein: '10g',
    };
  };

  if (loading) {
    return <div className="py-20 text-center">Loading Bestsellers...</div>
  }

  if (featuredProducts.length === 0) return null;

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
            {featuredProducts.map((sp, index) => (
              <div
                key={sp.productVariantId}
                className="flex-[0_0_calc(85%-8px)] sm:flex-[0_0_calc(50%-8px)] lg:flex-[0_0_calc(33.333%-11px)] xl:flex-[0_0_calc(25%-12px)] min-w-0 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProductCard product={mapToProductCardProps(sp)} />
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
              className={`w-2 h-2 rounded-full transition-all duration-300 ${index === selectedIndex
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
