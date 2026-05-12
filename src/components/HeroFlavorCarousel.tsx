import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { ArrowRight, Check, FileText, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { landingFlavours, type LandingFlavor } from '@/data/landingFlavours';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/components/ui/use-toast';
import { NutritionFactsCard } from '@/components/NutritionFactsCard';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

/**
 * Reorder so Peri-Peri shows first in the carousel — user wants it as the
 * centered/leading card. Keeps the rest of the lineup in label order.
 */
const orderedFlavours: LandingFlavor[] = [
  ...landingFlavours.filter((f) => f.id === 'peri'),
  ...landingFlavours.filter((f) => f.id !== 'peri'),
];

interface FlavorCardProps {
  flavour: LandingFlavor;
  /** Cards render under refs so an IntersectionObserver can track the active one */
  cardRef: (el: HTMLElement | null) => void;
  isActive: boolean;
  index: number;
  onAddToCart: (f: LandingFlavor) => void;
  recentlyAdded: boolean;
}

const FlavorCard = ({ flavour, cardRef, isActive, index, onAddToCart, recentlyAdded }: FlavorCardProps) => {
  return (
    <article
      ref={cardRef}
      data-idx={index}
      className={`aura-hero-card snap-center ${isActive ? 'is-active' : ''}`}
      style={
        {
          '--card-accent': flavour.accent,
          '--card-soft': flavour.accentSoft,
          '--card-deep': flavour.accentDeep,
        } as CSSProperties
      }
    >
      <div className="aura-hero-card-band" aria-hidden="true" />
      <div className="aura-hero-card-image-wrap">
        <img
          src={flavour.image}
          alt={flavour.alt}
          loading={index === 0 ? 'eager' : 'lazy'}
          decoding="async"
          width="380"
          height="750"
        />
      </div>

      <div className="aura-hero-card-body">
        <p className="aura-hero-card-tag">{flavour.tag}</p>
        <h3 className="aura-hero-card-name">{flavour.name}</h3>

        <div className="aura-hero-card-stats">
          <div>
            <span className="aura-hero-card-stat-label">Per serve</span>
            <span className="aura-hero-card-stat-value">
              {flavour.nutrition.rows[0]?.per70g.replace(' kcal', '')} kcal
            </span>
          </div>
          <div>
            <span className="aura-hero-card-stat-label">Protein</span>
            <span className="aura-hero-card-stat-value">{flavour.nutrition.rows[1]?.per70g}</span>
          </div>
          <div>
            <span className="aura-hero-card-stat-label">Price</span>
            <span className="aura-hero-card-stat-value">
              ₹{flavour.price}
              {flavour.mrp && flavour.mrp > flavour.price ? (
                <span className="aura-hero-card-mrp">₹{flavour.mrp}</span>
              ) : null}
            </span>
          </div>
        </div>

        <div className="aura-hero-card-actions">
          <button
            type="button"
            onClick={() => onAddToCart(flavour)}
            className="aura-hero-card-btn aura-hero-card-btn-primary"
          >
            {recentlyAdded ? (
              <>
                <Check className="h-4 w-4" />
                Added
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4" />
                Add to cart
              </>
            )}
          </button>
          <Link to={flavour.shopPath} className="aura-hero-card-btn aura-hero-card-btn-ghost">
            Shop now
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <button type="button" className="aura-hero-card-nutri">
              <FileText className="h-3.5 w-3.5" />
              View nutrition & ingredients
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl p-0 overflow-hidden bg-transparent border-none shadow-none">
            <DialogHeader className="sr-only">
              <DialogTitle>{flavour.name} nutrition facts and ingredients</DialogTitle>
            </DialogHeader>
            <NutritionFactsCard flavour={flavour} />
          </DialogContent>
        </Dialog>
      </div>
    </article>
  );
};

export const HeroFlavorCarousel = () => {
  const { addToCart, setIsCartOpen } = useCart();
  const { toast } = useToast();
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  // Track which card is centered in the viewport to drive the dot indicator
  // and the accent-coloured background tint behind the carousel.
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    let last = 0;

    const io = new IntersectionObserver(
      (entries) => {
        let best = last;
        let bestRatio = 0;
        for (const entry of entries) {
          if (entry.intersectionRatio > bestRatio) {
            bestRatio = entry.intersectionRatio;
            const idx = Number((entry.target as HTMLElement).dataset.idx);
            if (!Number.isNaN(idx)) best = idx;
          }
        }
        if (best !== last) {
          last = best;
          setActiveIdx(best);
        }
      },
      { root: scroller, threshold: [0.55, 0.75, 0.95] },
    );

    cardRefs.current.forEach((el) => {
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  const handleAdd = (flavour: LandingFlavor) => {
    addToCart({
      // Stable cart id — composite of SKU so size variants can extend later
      id: flavour.sku,
      name: 'AuraBites Makhana',
      flavor: flavour.name,
      price: flavour.price,
      image: flavour.image,
      flavorColor: flavour.accent,
    });
    setRecentlyAddedId(flavour.id);
    toast({
      title: `${flavour.name} added to cart`,
      description: `₹${flavour.price} · ${flavour.nutrition.servingSize} jar`,
    });
    setTimeout(() => setRecentlyAddedId((curr) => (curr === flavour.id ? null : curr)), 1600);
  };

  const active = orderedFlavours[activeIdx] ?? orderedFlavours[0];

  return (
    <section
      id="flavour-carousel"
      className="aura-hero-carousel"
      style={
        {
          '--carousel-accent': active.accent,
          '--carousel-soft': active.accentSoft,
          '--carousel-deep': active.accentDeep,
        } as CSSProperties
      }
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="aura-hero-carousel-head">
          <p className="ab-kicker">Pick your flavour</p>
          <h2 className="font-display text-3xl md:text-5xl font-extrabold leading-tight">
            Start with Peri-Peri. Swipe for more.
          </h2>
          <p className="aura-hero-carousel-sub">
            Tap "Add to cart" or browse the full lineup. Every jar = 70 g, 5+ servings of protein.
          </p>
        </div>

        <div ref={scrollerRef} className="aura-hero-scroller" role="region" aria-label="Flavour selector">
          <div className="aura-hero-edge" aria-hidden="true" />
          {orderedFlavours.map((flavour, idx) => (
            <FlavorCard
              key={flavour.id}
              flavour={flavour}
              cardRef={(el) => {
                cardRefs.current[idx] = el;
              }}
              isActive={idx === activeIdx}
              index={idx}
              onAddToCart={handleAdd}
              recentlyAdded={recentlyAddedId === flavour.id}
            />
          ))}
          <div className="aura-hero-edge" aria-hidden="true" />
        </div>

        <div className="aura-hero-dots" aria-hidden="true">
          {orderedFlavours.map((f, i) => (
            <button
              key={f.id}
              type="button"
              aria-label={`Scroll to ${f.name}`}
              className={i === activeIdx ? 'is-active' : ''}
              style={{ '--dot-color': f.accent } as CSSProperties}
              onClick={() => {
                cardRefs.current[i]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
              }}
            />
          ))}
        </div>

        <div className="aura-hero-cart-bar">
          <p>
            Cart adds save your flavour pick.{' '}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="aura-hero-cart-link"
            >
              View cart →
            </button>
          </p>
        </div>
      </div>
    </section>
  );
};
