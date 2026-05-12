import type { CSSProperties } from 'react';
import { ArrowRight, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { landingFlavours } from '@/data/landingFlavours';
import { NutritionFactsCard } from '@/components/NutritionFactsCard';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export const ProductGrid = () => {
  return (
    <section id="products" className="ab-section bg-[#0b0b0c] text-[#fff7ea]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="ab-kicker">Shop the jars</p>
            <h2 className="font-display text-4xl font-extrabold leading-tight md:text-6xl">
              Pick your flavour.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-[#b9aa96]">
            The same AuraBites jar, five bold flavour personalities, ready for your snack shelf.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {landingFlavours.map((flavour, index) => (
            <article
              key={flavour.id}
              className="ab-product-card group"
              style={{ '--product-accent': flavour.accent, animationDelay: `${index * 80}ms` } as CSSProperties}
            >
              <div className="ab-product-image-wrap">
                <img
                  src={flavour.image}
                  alt={flavour.alt}
                  width="380"
                  height="1280"
                  loading="lazy"
                  className="ab-product-image"
                />
              </div>
              <div className="space-y-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--product-accent)]">
                  {flavour.tag}
                </p>
                <h3 className="font-display text-2xl font-extrabold leading-none">
                  {flavour.name}
                </h3>
                <p className="min-h-[72px] text-sm leading-6 text-[#b9aa96]">
                  {flavour.description}
                </p>

                {/* Quick nutrition strip — pulled from real label */}
                <dl className="grid grid-cols-2 gap-2 rounded-xl bg-white/5 p-3 text-[11px]">
                  <div>
                    <dt className="text-[#8a7c6b]">Per serve (70 g)</dt>
                    <dd className="font-bold text-[#fff7ea]">
                      {flavour.nutrition.rows[0]?.per70g.replace(' kcal', '')} kcal
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[#8a7c6b]">Protein</dt>
                    <dd className="font-bold text-[#fff7ea]">
                      {flavour.nutrition.rows[1]?.per70g}
                    </dd>
                  </div>
                </dl>

                <div className="flex flex-wrap gap-2 pt-1">
                  <Link
                    to={flavour.shopPath}
                    className="inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-bold text-[#160d09] transition group-hover:-translate-y-0.5"
                  >
                    Shop Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button
                        type="button"
                        className="inline-flex items-center rounded-full border border-[#fff7ea]/30 px-3.5 py-2 text-xs font-semibold text-[#fff7ea] transition hover:bg-white/10"
                      >
                        <FileText className="mr-1.5 h-3.5 w-3.5" />
                        Nutrition
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
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
