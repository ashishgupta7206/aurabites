import { ArrowRight, ShoppingBag, Sparkles } from 'lucide-react';
import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { landingFlavours } from '@/data/landingFlavours';

export const HeroSection = () => {
  const heroFlavor = landingFlavours[0];

  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="ab-hero relative isolate min-h-screen overflow-hidden pt-24 text-[#fff7ea]">
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
            <Link to="/shop">
              <Button
                variant="outline"
                size="lg"
                className="w-full rounded-full border-white/25 bg-white/5 px-7 text-base font-bold text-white backdrop-blur-md hover:bg-white/12 hover:text-white sm:w-auto"
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                Shop Now
              </Button>
            </Link>
          </div>
        </div>

        <div className="ab-hero-jar-wrap mx-auto">
          <div className="ab-hero-ghost" aria-hidden="true">
            MAKHANA
          </div>
          <div className="ab-hero-jar">
            <img
              src={heroFlavor.image}
              alt={heroFlavor.alt}
              width="760"
              height="1500"
              className="ab-hero-jar-image"
            />
          </div>
          <div className="ab-hero-floor" aria-hidden="true" />
        </div>

        <div className="hidden justify-self-end lg:block">
          <div className="ab-hero-panel">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#ffb47a]">
              Now pouring
            </p>
            <h2 className="mt-4 font-display text-4xl font-extrabold leading-none">
              {heroFlavor.name}
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#d6c7b4]">
              {heroFlavor.description}
            </p>
            <div className="mt-7 grid grid-cols-2 gap-4 border-t border-white/10 pt-5">
              <div>
                <p className="font-display text-3xl font-extrabold">{heroFlavor.kcal}</p>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#a99680]">
                  kcal
                </p>
              </div>
              <div>
                <p className="font-display text-3xl font-extrabold">{heroFlavor.protein}</p>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#a99680]">
                  protein
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
