import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const CTASection = () => {
  return (
    <section className="relative overflow-hidden bg-[#f3eadb] py-24 text-[#21130c] md:py-32">
      <div className="ab-cta-glow" aria-hidden="true" />
      <div className="container relative z-10 mx-auto px-4 text-center">
        <p className="ab-kicker text-[#9a3b18]">Ready when cravings are</p>
        <h2 className="mx-auto max-w-4xl font-display text-5xl font-extrabold leading-none md:text-7xl">
          Your everyday snack, upgraded.
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[#6f5b4d] md:text-lg">
          Choose your flavour and enjoy light, roasted makhana anytime.
        </p>
        <Link to="/shop" className="mt-9 inline-block">
          <Button size="lg" className="rounded-full bg-[#1d120d] px-8 py-6 text-base font-bold text-white hover:bg-[#3b2518]">
            Shop AuraBites
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>
    </section>
  );
};
