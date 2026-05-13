import { Ban, Bone, Flame, HeartPulse, Leaf, ShieldPlus } from 'lucide-react';
import type { CSSProperties } from 'react';

const benefits = [
  {
    title: 'No Palm Oil',
    detail: 'Roasted with a cleaner oil profile for everyday munching.',
    stat: '0',
    statLabel: 'palm oil',
    icon: Ban,
    accent: '#E84F1A',
  },
  {
    title: 'Roasted, Not Fried',
    detail: 'Crisp, airy crunch without the heavy fried snack feeling.',
    stat: '100%',
    statLabel: 'roasted',
    icon: Flame,
    accent: '#A33323',
  },
  {
    title: 'Rich in Fiber',
    detail: 'A more satisfying snack built around naturally light makhana.',
    stat: 'Fiber',
    statLabel: 'friendly',
    icon: Leaf,
    accent: '#3D9A4E',
  },
  {
    title: '12 Vital Nutrients',
    detail: 'A better pantry pick when cravings need something smarter.',
    stat: '12',
    statLabel: 'nutrients',
    icon: ShieldPlus,
    accent: '#3FA9C9',
  },
  {
    title: 'Bone Health',
    detail: 'Makhana brings mineral-rich goodness in a clean snack format.',
    stat: 'Daily',
    statLabel: 'support',
    icon: Bone,
    accent: '#D9879C',
  },
  {
    title: 'Heart Health',
    detail: 'Light, roasted and flavour-forward without snack-time heaviness.',
    stat: 'Light',
    statLabel: 'snacking',
    icon: HeartPulse,
    accent: '#8B5A2B',
  },
];

export const BenefitsSection = () => {
  return (
    <section className="ab-benefits-section ab-section text-[#23150d]">
      <div className="container mx-auto px-4">
        <div className="ab-benefits-head">
          <div>
            <p className="ab-kicker text-[#9a3b18]">Why makhana</p>
            <h2 className="font-display text-4xl font-extrabold leading-tight md:text-6xl">
              Clean crunch. Real snack energy.
            </h2>
          </div>
          <div className="ab-benefits-proof">
            <span>6 snack wins</span>
            <span>70g jars</span>
            <span>Bold flavours</span>
          </div>
          <p className="ab-benefits-copy">
            AuraBites is built for cravings that want flavour, crunch and a lighter finish.
            Premium roasted makhana, tuned for modern snacking.
          </p>
        </div>

        <div className="ab-benefits-grid">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <article
                key={benefit.title}
                className="ab-benefit-card"
                style={
                  {
                    '--benefit-accent': benefit.accent,
                    animationDelay: `${index * 70}ms`,
                  } as CSSProperties
                }
              >
                <div className="ab-benefit-topline">
                  <span className="ab-benefit-icon">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="ab-benefit-number">0{index + 1}</span>
                </div>
                <div className="ab-benefit-stat">
                  <strong>{benefit.stat}</strong>
                  <span>{benefit.statLabel}</span>
                </div>
                <h3 className="font-display text-xl font-extrabold leading-tight">
                  {benefit.title}
                </h3>
                <p>{benefit.detail}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
