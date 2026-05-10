import { Ban, Bone, Flame, HeartPulse, Leaf, ShieldPlus } from 'lucide-react';

const benefits = [
  { title: 'No Palm Oil', detail: 'Clean roast', icon: Ban },
  { title: 'Roasted, Not Fried', detail: 'Light crunch', icon: Flame },
  { title: 'Rich in Fiber', detail: 'Better snacking', icon: Leaf },
  { title: '12 Vital Nutrients', detail: 'Daily goodness', icon: ShieldPlus },
  { title: 'Bone Health', detail: 'Calcium support', icon: Bone },
  { title: 'Heart Health', detail: 'Low guilt', icon: HeartPulse },
];

export const BenefitsSection = () => {
  return (
    <section className="ab-section bg-[#f5efe2] text-[#23150d]">
      <div className="container mx-auto px-4">
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
          <div>
            <p className="ab-kicker text-[#9a3b18]">Why makhana</p>
            <h2 className="font-display text-4xl font-extrabold leading-tight md:text-6xl">
              A snack that earns its place in the jar.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-8 text-[#6f5b4d] lg:justify-self-end">
            Lotus seeds roasted for crunch, flavour and a lighter everyday munch. No palm oil, no deep fry, no shortcut energy crash.
          </p>
        </div>

        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div key={benefit.title} className="ab-benefit-card" style={{ animationDelay: `${index * 70}ms` }}>
                <span className="ab-benefit-icon">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="font-display text-lg font-extrabold leading-tight">
                  {benefit.title}
                </h3>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a7665]">
                  {benefit.detail}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
