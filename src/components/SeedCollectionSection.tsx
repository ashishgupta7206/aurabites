import { useCallback, useEffect, useMemo, useState, type CSSProperties } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowRight, ChevronLeft, ChevronRight, FileText, Leaf, PackageCheck, ShoppingCart, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { seedProducts, type SeedProduct } from '@/data/seedProducts';

interface SeedCatalogImage {
  imageUrl: string;
  sortOrder?: number | null;
}

interface SeedCatalogRow {
  productId: number;
  productName?: string;
  productVariantId: number;
  productVariantName?: string;
  productVariantSku: string;
  price: number;
  mrp?: number;
  mainImage?: string;
  color?: string | null;
  images?: SeedCatalogImage[];
}

interface SeedProductMatch {
  productId: number;
  productVariantId: number;
  productName?: string;
  productVariantName?: string;
  price: number;
  mrp?: number;
  image?: string;
  color?: string | null;
}

const seedStats = [
  { label: 'Varieties', value: '8' },
  { label: 'Jar size', value: '500g' },
  { label: 'Preservatives', value: 'Zero' },
];

const FALLBACK_SEED_PRICE = 199;
const FALLBACK_SEED_MRP = 299;

const getProductImage = (product: SeedCatalogRow) => {
  const sortedImages = [...(product.images ?? [])].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  return sortedImages.find((image) => image.imageUrl)?.imageUrl || product.mainImage;
};

const LabelPreviewButton = ({
  seed,
  className,
  label = 'View Label',
}: {
  seed: SeedProduct;
  className?: string;
  label?: string;
}) => (
  <Dialog>
    <DialogTrigger asChild>
      <button type="button" className={className}>
        <FileText className="h-4 w-4" />
        {label}
      </button>
    </DialogTrigger>
    <DialogContent className="max-w-6xl overflow-hidden border-[#4b2a12]/10 bg-[#fff7ea] p-2 shadow-2xl">
      <DialogHeader className="px-3 pt-3 text-left">
        <DialogTitle className="font-display text-2xl text-[#21140d]">{seed.name} label</DialogTitle>
      </DialogHeader>
      <img
        src={seed.labelImage}
        alt={seed.labelAlt}
        width="1500"
        height="750"
        loading="lazy"
        decoding="async"
        className="max-h-[78vh] w-full rounded-2xl object-contain"
      />
    </DialogContent>
  </Dialog>
);

export const SeedCollectionSection = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [productMatches, setProductMatches] = useState<Record<string, SeedProductMatch>>({});
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'center', loop: true });
  const { addToCart, setIsCartOpen } = useCart();
  const { toast } = useToast();

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
  const seedSkuLookup = useMemo(() => new Set(seedProducts.map((seed) => seed.sku)), []);

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

    const fetchSeedProducts = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/products/search`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productType: 'JAR',
            pagination: { page: 0, size: 200 },
            sorting: [{ orderBy: 'id', order: 'desc' }],
          }),
        });

        if (!response.ok) return;

        const payload = await response.json();
        const rows: SeedCatalogRow[] = Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload?.data?.content)
            ? payload.data.content
            : [];

        const matches = rows.reduce<Record<string, SeedProductMatch>>((nextMatches, product) => {
          if (seedSkuLookup.has(product.productVariantSku)) {
            nextMatches[product.productVariantSku] = {
              productId: product.productId,
              productVariantId: product.productVariantId,
              productName: product.productName,
              productVariantName: product.productVariantName,
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

    fetchSeedProducts();

    return () => {
      isMounted = false;
    };
  }, [apiBaseUrl, seedSkuLookup]);

  const activeSeed = seedProducts[selectedIndex] ?? seedProducts[0];
  const activeProduct = productMatches[activeSeed.sku];
  const activePrice =
    typeof activeProduct?.price === 'number' && Number.isFinite(activeProduct.price)
      ? activeProduct.price
      : FALLBACK_SEED_PRICE;
  const activeMrp = activeProduct?.mrp ?? FALLBACK_SEED_MRP;
  const activeShopPath = activeProduct?.productId ? `/product/${activeProduct.productId}` : activeSeed.shopPath;
  const seedStyle = {
    '--seed-accent': activeSeed.accent,
    '--seed-soft': activeSeed.accentSoft,
    '--seed-deep': activeSeed.accentDeep,
  } as CSSProperties;

  const handleAddSeed = (seed: SeedProduct) => {
    const product = productMatches[seed.sku];
    if (!product) {
      toast({
        title: 'Seed jar is syncing',
        description: 'Please try again once the product catalog finishes loading.',
      });
      return;
    }

    const price =
      typeof product.price === 'number' && Number.isFinite(product.price) ? product.price : FALLBACK_SEED_PRICE;

    addToCart({
      id: String(product.productVariantId),
      name: product.productVariantName || `AuraBites ${seed.name} Jar`,
      flavor: seed.name,
      price,
      image: product.image || seed.jarImage,
      flavorColor: product.color || seed.accent,
      quantity: 1,
    });

    toast({
      title: `${seed.name} added to cart`,
      description: `Rs ${price} seed jar is ready for checkout.`,
    });
    setIsCartOpen(true);
  };

  return (
    <section id="seed-jars" className="ab-seed-section ab-section text-[#fff7ea]" style={seedStyle}>
      <div className="ab-studio-grain" aria-hidden="true" />
      <div className="ab-seed-orbit" aria-hidden="true">
        {Array.from({ length: 14 }).map((_, index) => (
          <span
            key={index}
            style={
              {
                '--i': index,
                animationDelay: `${index * -0.31}s`,
              } as CSSProperties
            }
          />
        ))}
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="ab-seed-hero">
          <div className="ab-seed-copy">
            <p className="ab-seed-kicker">
              <Sparkles className="h-4 w-4" />
              AuraBites seed jars
            </p>
            <h2 className="font-display text-5xl font-extrabold leading-[0.9] tracking-tight md:text-7xl">
              Tiny seeds. Big nutrition.
            </h2>
            <p>
              A premium pantry line of clean 500g seed jars for bowls, drinks, baking, snacks and daily nutrition.
            </p>
            <div className="ab-seed-stats" aria-label="AuraBites seed jar highlights">
              {seedStats.map((stat) => (
                <div key={stat.label}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="ab-seed-stage" aria-label="Swipe AuraBites seed jars">
            <div className="ab-seed-ghost" aria-hidden="true">
              {activeSeed.shortName}
            </div>
            <div className="ab-seed-carousel-viewport" ref={emblaRef}>
              <div className="ab-seed-carousel-track">
                {seedProducts.map((seed, index) => (
                  <div
                    key={seed.id}
                    className={`ab-seed-carousel-slide ${index === selectedIndex ? 'is-active' : ''}`}
                  >
                    <img
                      src={seed.jarImage}
                      alt={seed.alt}
                      width="760"
                      height="1200"
                      loading={index === 0 ? 'eager' : 'lazy'}
                      decoding="async"
                      className="ab-seed-jar-image"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="ab-seed-floor" aria-hidden="true" />
            <div className="ab-seed-controls" aria-label="Seed jar carousel controls">
              <button type="button" onClick={() => emblaApi?.scrollPrev()} aria-label="Previous seed jar">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="ab-seed-dots">
                {seedProducts.map((seed, index) => (
                  <button
                    key={seed.id}
                    type="button"
                    aria-label={`Show ${seed.name}`}
                    aria-current={index === selectedIndex ? 'true' : undefined}
                    className={index === selectedIndex ? 'is-active' : ''}
                    style={{ '--dot-accent': seed.accent } as CSSProperties}
                    onClick={() => emblaApi?.scrollTo(index)}
                  />
                ))}
              </div>
              <button type="button" onClick={() => emblaApi?.scrollNext()} aria-label="Next seed jar">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <aside className="ab-seed-panel">
            <p className="ab-seed-panel-kicker">Seed spotlight</p>
            <h3 className="font-display text-4xl font-extrabold leading-none">{activeSeed.name}</h3>
            <p>{activeSeed.description}</p>
            <dl className="ab-seed-panel-facts">
              <div>
                <dt>Protein / 100g</dt>
                <dd>{activeSeed.protein}</dd>
              </div>
              <div>
                <dt>Net wt.</dt>
                <dd>{activeSeed.netWeight}</dd>
              </div>
            </dl>
            <div className="ab-seed-price-row">
              <strong>Rs {activePrice}</strong>
              {activeMrp > activePrice ? <span>MRP Rs {activeMrp}</span> : null}
            </div>
            <div className="ab-seed-panel-actions">
              <Button
                type="button"
                onClick={() => handleAddSeed(activeSeed)}
                disabled={!activeProduct}
                className="ab-seed-primary"
              >
                <ShoppingCart className="h-4 w-4" />
                {activeProduct ? 'Add to Cart' : 'Loading'}
              </Button>
              <Button asChild variant="outline" className="ab-seed-secondary">
                <Link to={activeShopPath}>
                  Shop Now
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <LabelPreviewButton seed={activeSeed} className="ab-seed-label-wide" />
          </aside>
        </div>

        <div className="ab-seed-listing-head">
          <div>
            <p className="ab-kicker">Complete seed lineup</p>
            <h3 className="font-display text-4xl font-extrabold leading-tight text-[#fff7ea] md:text-5xl">
              All eight seed jars.
            </h3>
          </div>
          <p>
            Each jar keeps the same AuraBites studio language: clear PET packaging, bold label colour, real seed texture
            and a full back-label preview for serious shoppers.
          </p>
        </div>

        <div className="ab-seed-grid">
          {seedProducts.map((seed, index) => {
            const product = productMatches[seed.sku];
            const price =
              typeof product?.price === 'number' && Number.isFinite(product.price)
                ? product.price
                : FALLBACK_SEED_PRICE;
            const mrp = product?.mrp ?? FALLBACK_SEED_MRP;
            const shopPath = product?.productId ? `/product/${product.productId}` : seed.shopPath;

            return (
              <article
                key={seed.id}
                className="ab-seed-card"
                style={{ '--seed-card-accent': seed.accent, animationDelay: `${index * 70}ms` } as CSSProperties}
              >
                <div className="ab-seed-card-media">
                  <img
                    src={seed.jarImage}
                    alt={seed.alt}
                    width="520"
                    height="820"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="ab-seed-card-body">
                  <p className="ab-seed-card-meta">
                    <Leaf className="h-3.5 w-3.5" />
                    100% seeds
                  </p>
                  <h4>{seed.name}</h4>
                  <p>{seed.detail}</p>
                  <div className="ab-seed-card-proof">
                    <span>{seed.protein} protein / 100g</span>
                    <span>{seed.netWeight} jar</span>
                    <span>Rs {price}{mrp > price ? ` / MRP Rs ${mrp}` : ''}</span>
                  </div>
                  <div className="ab-seed-card-actions">
                    <button
                      type="button"
                      onClick={() => handleAddSeed(seed)}
                      disabled={!product}
                      className="ab-seed-card-cart"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      {product ? 'Add' : 'Sync'}
                    </button>
                    <Link to={shopPath}>
                      <PackageCheck className="h-4 w-4" />
                      Shop
                    </Link>
                    <LabelPreviewButton seed={seed} className="ab-seed-card-label" label="Label" />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
