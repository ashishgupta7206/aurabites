import { useCallback, useEffect, useMemo, useState, type CSSProperties } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowRight, ChevronLeft, ChevronRight, ShoppingBag, ShoppingCart, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/components/ui/use-toast';
import { landingFlavours } from '@/data/landingFlavours';

interface CatalogProductImage {
  imageUrl: string;
  sortOrder?: number | null;
}

interface CatalogProductRow {
  productId: number;
  productName?: string;
  productVariantId: number;
  productVariantName?: string;
  productVariantSku: string;
  price: number;
  mrp?: number;
  mainImage?: string;
  color?: string | null;
  images?: CatalogProductImage[];
}

interface HeroProductMatch {
  productId: number;
  productVariantId: number;
  productVariantName?: string;
  price: number;
  mrp?: number;
  image?: string;
  color?: string | null;
}

const getProductImage = (product: CatalogProductRow) => {
  const sortedImages = [...(product.images ?? [])].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  return sortedImages.find((image) => image.imageUrl)?.imageUrl || product.mainImage;
};

export const HeroSection = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [productMatches, setProductMatches] = useState<Record<string, HeroProductMatch>>({});
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'center', loop: true });
  const { addToCart, setIsCartOpen } = useCart();
  const { toast } = useToast();

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
  const skuLookup = useMemo(() => new Set(landingFlavours.map((flavour) => flavour.sku)), []);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
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

  useEffect(() => {
    let isMounted = true;

    const fetchJarProducts = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/products/search`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productType: 'JAR',
            pagination: { page: 0, size: 100 },
            sorting: [{ orderBy: 'id', order: 'asc' }],
          }),
        });

        if (!response.ok) return;

        const payload = await response.json();
        const rows: CatalogProductRow[] = Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload?.data?.content)
            ? payload.data.content
            : [];

        const matches = rows.reduce<Record<string, HeroProductMatch>>((nextMatches, product) => {
          if (skuLookup.has(product.productVariantSku)) {
            nextMatches[product.productVariantSku] = {
              productId: product.productId,
              productVariantId: product.productVariantId,
              productVariantName: product.productVariantName || product.productName,
              price: Number(product.price),
              mrp: product.mrp ? Number(product.mrp) : undefined,
              image: getProductImage(product),
              color: product.color,
            };
          }

          return nextMatches;
        }, {});

        if (isMounted) {
          setProductMatches(matches);
        }
      } catch {
        if (isMounted) {
          setProductMatches({});
        }
      }
    };

    fetchJarProducts();

    return () => {
      isMounted = false;
    };
  }, [apiBaseUrl, skuLookup]);

  const activeFlavor = landingFlavours[selectedIndex] ?? landingFlavours[0];
  const activeProduct = productMatches[activeFlavor.sku];
  const activePrice =
    typeof activeProduct?.price === 'number' && Number.isFinite(activeProduct.price)
      ? activeProduct.price
      : activeFlavor.price;
  const activeMrp = activeProduct?.mrp ?? activeFlavor.mrp;
  const activeProductPath = activeProduct?.productId ? `/product/${activeProduct.productId}` : activeFlavor.shopPath;

  const heroStyle = {
    '--hero-accent': activeFlavor.accent,
    '--hero-soft': activeFlavor.accentSoft,
    '--hero-deep': activeFlavor.accentDeep,
  } as CSSProperties;

  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleAddToCart = () => {
    addToCart({
      id: activeProduct?.productVariantId ? String(activeProduct.productVariantId) : activeFlavor.sku,
      name: activeProduct?.productVariantName || 'AuraBites Makhana',
      flavor: activeFlavor.name,
      price: activePrice,
      image: activeProduct?.image || activeFlavor.image,
      flavorColor: activeProduct?.color || activeFlavor.accent,
      quantity: 1,
    });

    toast({
      title: `${activeFlavor.name} added to cart`,
      description: `Rs ${activePrice} jar is ready for checkout.`,
    });
    setIsCartOpen(true);
  };

  return (
    <section className="ab-hero relative isolate min-h-screen overflow-hidden pt-24 text-[#fff7ea]" style={heroStyle}>
      <div className="ab-studio-grain" aria-hidden="true" />
      <div className="ab-particle-field" aria-hidden="true">
        {Array.from({ length: 20 }).map((_, index) => (
          <span
            key={index}
            style={
              {
                '--i': index,
                left: `${6 + index * 4.6}%`,
                top: `${12 + (index % 6) * 12}%`,
                animationDelay: `${index * -0.37}s`,
              } as CSSProperties
            }
          />
        ))}
      </div>

      <div className="container relative z-10 mx-auto grid min-h-[calc(100vh-6rem)] items-center gap-10 px-4 py-12 lg:grid-cols-[1fr_minmax(320px,520px)_1fr]">
        <div className="max-w-xl space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#ffd2a8] backdrop-blur-md">
            <Sparkles className="h-4 w-4" />
            Premium roasted makhana
          </div>

          <div className="space-y-5">
            <h1 className="font-display text-5xl font-extrabold leading-[0.9] tracking-tight text-balance md:text-7xl xl:text-8xl">
              Snack Light. Crunch Right.
            </h1>
            <p className="mx-auto max-w-[21rem] text-base leading-8 text-[#d6c7b4] md:max-w-xl md:text-xl lg:mx-0">
              Premium roasted makhana in bold Indian-inspired flavours.
            </p>
          </div>

          <div className="mx-auto flex w-full max-w-[20rem] flex-col gap-3 sm:flex-row sm:justify-center lg:mx-0 lg:max-w-none lg:justify-start">
            <Button
              type="button"
              size="lg"
              onClick={scrollToProducts}
              className="w-full rounded-full bg-[#f7efe2] px-7 text-base font-bold text-[#1b120d] shadow-[0_18px_50px_rgba(232,79,26,0.28)] hover:bg-white sm:w-auto"
            >
              Explore Flavours
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full rounded-full border-white/25 bg-white/5 px-7 text-base font-bold text-white backdrop-blur-md hover:bg-white/12 hover:text-white sm:w-auto"
            >
              <Link to={activeProductPath}>
                <ShoppingBag className="mr-2 h-5 w-5" />
                Shop Now
              </Link>
            </Button>
          </div>
        </div>

        <div className="ab-hero-jar-wrap mx-auto">
          <div className="ab-hero-ghost" aria-hidden="true">
            {activeFlavor.shortName}
          </div>
          <div className="ab-hero-jar">
            <div className="ab-hero-carousel-viewport" ref={emblaRef}>
              <div className="ab-hero-carousel-track">
                {landingFlavours.map((flavour, index) => (
                  <div
                    key={flavour.id}
                    className={`ab-hero-carousel-slide ${index === selectedIndex ? 'is-active' : ''}`}
                  >
                    <img
                      src={flavour.image}
                      alt={flavour.alt}
                      width="760"
                      height="1500"
                      loading={index === 0 ? 'eager' : 'lazy'}
                      decoding="async"
                      className="ab-hero-jar-image"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="ab-hero-floor" aria-hidden="true" />

          <div className="ab-hero-carousel-controls" aria-label="Hero flavour carousel controls">
            <button type="button" className="ab-hero-carousel-arrow" onClick={() => emblaApi?.scrollPrev()} aria-label="Previous flavour">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="ab-hero-carousel-dots">
              {landingFlavours.map((flavour, index) => (
                <button
                  key={flavour.id}
                  type="button"
                  aria-label={`Show ${flavour.name}`}
                  aria-current={index === selectedIndex ? 'true' : undefined}
                  className={index === selectedIndex ? 'is-active' : ''}
                  style={{ '--dot-accent': flavour.accent } as CSSProperties}
                  onClick={() => emblaApi?.scrollTo(index)}
                />
              ))}
            </div>
            <button type="button" className="ab-hero-carousel-arrow" onClick={() => emblaApi?.scrollNext()} aria-label="Next flavour">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="justify-self-stretch lg:justify-self-end">
          <div className="ab-hero-panel">
            <p className="ab-hero-panel-kicker">
              Now pouring
            </p>
            <h2 className="mt-4 font-display text-4xl font-extrabold leading-none">
              {activeFlavor.name}
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#d6c7b4]">
              {activeFlavor.description}
            </p>
            <div className="mt-7 grid grid-cols-2 gap-4 border-t border-white/10 pt-5">
              <div>
                <p className="font-display text-3xl font-extrabold">{activeFlavor.kcal}</p>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#a99680]">
                  kcal
                </p>
              </div>
              <div>
                <p className="font-display text-3xl font-extrabold">{activeFlavor.protein}</p>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#a99680]">
                  protein
                </p>
              </div>
            </div>

            <div className="ab-hero-price-row">
              <div>
                <p className="ab-hero-price">Rs {activePrice}</p>
                {activeMrp && activeMrp > activePrice ? (
                  <p className="ab-hero-mrp">MRP Rs {activeMrp}</p>
                ) : null}
              </div>
              <span className="ab-hero-pack">70g jar</span>
            </div>

            <div className="ab-hero-panel-actions">
              <Button type="button" onClick={handleAddToCart} className="ab-hero-cart-btn">
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </Button>
              <Button asChild variant="outline" className="ab-hero-shop-btn">
                <Link to={activeProductPath}>
                  Shop Now
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
