import type { CSSProperties } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { landingFlavours } from '@/data/landingFlavours';

export const ProductShowcase = () => {
  return (
    <section className="ab-section bg-[#0b0b0c] text-[#fff7ea]">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <p className="ab-kicker">The flavour deck</p>
          <h2 className="font-display text-4xl font-extrabold leading-tight md:text-6xl">
            Five moods. One continuous crunch.
          </h2>
          <p className="mt-5 text-base leading-8 text-[#b9aa96]">
            Every jar keeps the same clean roasted makhana base, then shifts into a bold flavour state.
          </p>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-5">
          {landingFlavours.map((flavour, index) => (
            <a
              key={flavour.id}
              href="#flavours"
              className="ab-showcase-card group"
              style={{ '--card-accent': flavour.accent, animationDelay: `${index * 80}ms` } as CSSProperties}
            >
              <div className="flex items-center justify-between">
                <span className="h-3 w-3 rounded-full bg-[var(--card-accent)] shadow-[0_0_24px_var(--card-accent)]" />
                <ArrowUpRight className="h-4 w-4 text-white/40 transition group-hover:text-white" />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/45">
                  {flavour.tag}
                </p>
                <h3 className="mt-3 font-display text-2xl font-extrabold leading-none">
                  {flavour.name}
                </h3>
                <p className="mt-4 text-sm leading-6 text-[#b9aa96]">
                  {flavour.description}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
