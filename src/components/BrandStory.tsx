import type { CSSProperties } from 'react';

export const BrandStory = () => {
  return (
    <section className="ab-story relative overflow-hidden bg-[#11100d] py-24 text-[#fff7ea] md:py-32">
      <div className="ab-story-orbit" aria-hidden="true">
        {Array.from({ length: 14 }).map((_, index) => (
          <span
            key={index}
            style={
              {
                '--i': index,
                left: `${5 + index * 6.5}%`,
                top: `${14 + (index % 5) * 15}%`,
                animationDelay: `${index * -0.31}s`,
              } as CSSProperties
            }
          />
        ))}
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <p className="ab-kicker">Our story</p>
          <h2 className="font-display text-4xl font-extrabold leading-tight md:text-7xl">
            Cleaner snacking, louder flavour.
          </h2>
          <p className="mt-7 text-lg leading-9 text-[#d2c1aa] md:text-xl">
            AuraBites brings everyday snacking a cleaner, lighter upgrade with roasted makhana crafted for flavour, crunch, and guilt-free munching.
          </p>
        </div>
      </div>
    </section>
  );
};
