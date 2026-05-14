import { useCallback, useEffect, useState, type CSSProperties } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowRight, ChevronLeft, ChevronRight, FileText, Leaf, PackageCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { seedProducts, type SeedProduct } from '@/data/seedProducts';

const seedStats = [
  { label: 'Varieties', value: '8' },
  { label: 'Jar size', value: '500g' },
  { label: 'Preservatives', value: 'Zero' },
];

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
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'center', loop: true });

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

  const activeSeed = seedProducts[selectedIndex] ?? seedProducts[0];
  const seedStyle = {
    '--seed-accent': activeSeed.accent,
    '--seed-soft': activeSeed.accentSoft,
    '--seed-deep': activeSeed.accentDeep,
  } as CSSProperties;

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
            <div className="ab-seed-panel-actions">
              <Button asChild className="ab-seed-primary">
                <Link to={activeSeed.shopPath}>
                  Shop Seeds
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <LabelPreviewButton seed={activeSeed} className="ab-seed-secondary" />
            </div>
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
          {seedProducts.map((seed, index) => (
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
                </div>
                <div className="ab-seed-card-actions">
                  <Link to={seed.shopPath}>
                    <PackageCheck className="h-4 w-4" />
                    Shop
                  </Link>
                  <LabelPreviewButton seed={seed} className="ab-seed-card-label" label="Label" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
