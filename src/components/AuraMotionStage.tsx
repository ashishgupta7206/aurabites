import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  clampMotion,
  lerpMotion,
  motionAccents,
  motionDots,
  motionMakhana,
  motionProducts,
  smoothMotion,
} from '@/data/auraMotion';

const productCenters = [0.24, 0.4, 0.54, 0.67, 0.77];

const windowPeak = (value: number, center: number, width: number) =>
  clampMotion(1 - Math.abs(value - center) / width);

// Mobile + reduced-motion users get the swipe carousel.
// Desktop gets the full scroll-driven animation.
const shouldUseCarousel = (): boolean => {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia('(max-width: 768px)').matches) return true;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
  return false;
};

// -----------------------------------------------------------------------------
// Mobile: horizontal swipe carousel with CSS scroll-snap
// -----------------------------------------------------------------------------
const FlavourCarousel = () => {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    let lastIdx = 0;

    const io = new IntersectionObserver(
      (entries) => {
        let best = lastIdx;
        let bestRatio = 0;
        for (const entry of entries) {
          if (entry.intersectionRatio > bestRatio) {
            bestRatio = entry.intersectionRatio;
            const idx = Number(entry.target.getAttribute('data-idx'));
            if (!Number.isNaN(idx)) best = idx;
          }
        }
        if (best !== lastIdx) {
          lastIdx = best;
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

  const active = motionProducts[activeIdx];

  return (
    <section
      id="flavours"
      className="aura-flavour-carousel"
      style={{ '--carousel-accent': active.accent, '--carousel-soft': active.accentSoft } as CSSProperties}
    >
      <div className="aura-flavour-carousel-head">
        <p className="ab-kicker">Our flavours</p>
        <h2 className="font-display text-3xl font-extrabold leading-tight md:text-5xl">
          Swipe through the lineup
        </h2>
        <p className="aura-flavour-carousel-sub">
          Five bold flavours of crunchy, roasted makhana.
        </p>
      </div>

      <div ref={scrollerRef} className="aura-flavour-scroller" role="region" aria-label="Flavour carousel">
        <div className="aura-flavour-edge" aria-hidden="true" />
        {motionProducts.map((product, idx) => (
          <article
            key={product.id}
            ref={(el) => {
              cardRefs.current[idx] = el;
            }}
            data-idx={idx}
            className="aura-flavour-card"
            style={
              { '--card-accent': product.accent, '--card-soft': product.accentSoft } as CSSProperties
            }
          >
            <div className="aura-flavour-card-band" aria-hidden="true" />
            <div className="aura-flavour-card-image-wrap">
              <img
                src={product.image}
                alt={product.name}
                loading={idx === 0 ? 'eager' : 'lazy'}
                decoding="async"
                width="380"
                height="750"
              />
            </div>
            <div className="aura-flavour-card-info">
              <p className="aura-flavour-card-tag">{product.shortName.toUpperCase()} ENERGY</p>
              <p className="aura-flavour-card-name">{product.name}</p>
            </div>
          </article>
        ))}
        <div className="aura-flavour-edge" aria-hidden="true" />
      </div>

      <div className="aura-flavour-dots" aria-hidden="true">
        {motionProducts.map((p, i) => (
          <span
            key={p.id}
            className={i === activeIdx ? 'is-active' : ''}
            style={{ '--dot-color': p.accent } as CSSProperties}
          />
        ))}
      </div>

      <Link to="/shop" className="aura-flavour-cta">
        Shop the lineup
        <ArrowRight className="ml-2 h-4 w-4" />
      </Link>
    </section>
  );
};

// -----------------------------------------------------------------------------
// Desktop: full scroll-driven motion (unchanged behaviour, ref-based for perf)
// -----------------------------------------------------------------------------
const FlavourScrollStage = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const rigRef = useRef<HTMLDivElement | null>(null);
  const lidRef = useRef<HTMLDivElement | null>(null);
  const productRefs = useRef<(HTMLImageElement | null)[]>([]);
  const makhanaRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const accentRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [phase, setPhase] = useState<'flavour' | 'full'>('flavour');

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let rafId: number | null = null;
    let visible = false;
    let lastActiveIdx = -1;
    let lastPhase: 'flavour' | 'full' | null = null;
    const startedAt = performance.now();

    const tick = (now: number) => {
      const rect = section.getBoundingClientRect();
      const maxScroll = Math.max(section.offsetHeight - window.innerHeight, 1);
      const t = clampMotion(-rect.top / maxScroll);
      const idle = (now - startedAt) / 1000;

      const scores = productCenters.map((c) => windowPeak(t, c, 0.13));
      let best = 0;
      for (let i = 1; i < scores.length; i++) if (scores[i] > scores[best]) best = i;
      const computedActive = t > 0.84 ? 0 : best;
      const currentPhase: 'flavour' | 'full' = t > 0.84 ? 'full' : 'flavour';
      if (computedActive !== lastActiveIdx) {
        lastActiveIdx = computedActive;
        setActiveIndex(computedActive);
      }
      if (currentPhase !== lastPhase) {
        lastPhase = currentPhase;
        setPhase(currentPhase);
      }

      const active = motionProducts[computedActive];

      const lidLift = smoothMotion(0.1, 0.29, t) * (1 - smoothMotion(0.78, 0.94, t));
      const flavourEnergy = smoothMotion(0.26, 0.55, t) * (1 - smoothMotion(0.86, 1, t));
      const finalFan = smoothMotion(0.78, 0.96, t);
      const intro = smoothMotion(0, 0.18, t);
      const stagePulse = Math.sin(idle * 1.4) * 0.5 + 0.5;

      const stage = stageRef.current;
      if (stage) {
        const s = stage.style;
        s.setProperty('--motion-accent', active.accent);
        s.setProperty('--motion-soft', active.accentSoft);
        s.setProperty('--motion-energy', String(flavourEnergy));
        s.setProperty('--motion-fan', String(finalFan));
        s.setProperty('--motion-pulse', String(stagePulse));
      }

      const rigScale = lerpMotion(0.82, 1.06, intro) + Math.sin(idle * 1.7) * 0.015;
      const rigY = lerpMotion(92, -12, intro) + Math.sin(idle * 1.25) * 9 - lidLift * 18 + finalFan * 20;
      const rigX = Math.sin(t * Math.PI * 4 + idle * 0.45) * 18 * flavourEnergy * (1 - finalFan);
      const rigR = lerpMotion(-5, 0, intro) + Math.sin(idle * 0.9) * 1.2 + flavourEnergy * Math.sin(t * 22) * 1.6;
      const rig = rigRef.current;
      if (rig) {
        rig.style.transform = `translate3d(${rigX}px, ${rigY}px, 0) rotate(${rigR}deg) scale(${rigScale})`;
      }

      for (let i = 0; i < motionProducts.length; i++) {
        const product = motionProducts[i];
        const el = productRefs.current[i];
        if (!el) continue;
        const productPeak = windowPeak(t, productCenters[i], 0.14);
        const introPresence = i === 0 ? 1 - smoothMotion(0.16, 0.31, t) : 0;
        const activeOpacity = Math.max(productPeak, introPresence) * (1 - finalFan);
        const finalOpacity = finalFan * (i === 0 ? 1 : 0.82);
        const opacity = Math.max(activeOpacity, finalOpacity);
        const drift = Math.sin(idle * 1.1 + i) * 9 * productPeak * (1 - finalFan);
        const x = product.finalX * finalFan + drift;
        const y = product.finalY * finalFan + Math.sin(idle * 1.25 + i) * 7 * (activeOpacity + finalFan * 0.25);
        const rotate = product.finalRotate * finalFan + Math.sin(idle * 0.7 + i) * 1.1 * activeOpacity;
        const scale = lerpMotion(1, product.finalScale, finalFan) * lerpMotion(0.94, 1.02, activeOpacity);
        el.style.opacity = String(opacity);
        el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rotate}deg) scale(${scale})`;
        el.style.zIndex = String(Math.round(80 + opacity * 100 - Math.abs(product.finalX) * finalFan * 0.08));
      }

      const lid = lidRef.current;
      if (lid) {
        lid.style.opacity = String(smoothMotion(0.04, 0.16, t) * (1 - finalFan));
        lid.style.transform = `translate(-50%, -50%) translate3d(${lidLift * 70 + Math.sin(idle * 2) * 10}px, ${120 - lidLift * 260 + finalFan * 90}px, 0) rotate(${-8 + lidLift * 48 + t * 140}deg) scale(${0.82 + lidLift * 0.2})`;
      }

      for (let i = 0; i < motionMakhana.length; i++) {
        const ball = motionMakhana[i];
        const el = makhanaRefs.current[i];
        if (!el) continue;
        const pop = smoothMotion(0.13 + ball.delay, 0.36 + ball.delay, t);
        const settle = smoothMotion(0.72, 0.96, t);
        const air = Math.sin(clampMotion((t - 0.13 - ball.delay) / 0.54) * Math.PI);
        const angle = ball.angle + idle * 0.18 + t * 2.1;
        const x = Math.cos(angle) * ball.radius * pop * (1 - settle * 0.35);
        const y = 40 + Math.sin(angle) * ball.radius * 0.32 * pop - air * 210 + settle * 130;
        el.style.opacity = String(pop * (1 - settle * 0.55));
        el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${ball.spin * t + idle * 18}deg) scale(${ball.size * lerpMotion(0.42, 1, pop)})`;
      }

      for (let i = 0; i < motionAccents.length; i++) {
        const accent = motionAccents[i];
        const el = accentRefs.current[i];
        if (!el) continue;
        const orbit = smoothMotion(0.3, 0.58, t) * (1 - finalFan * 0.7);
        const typeBoost = active.ingredient === accent.type ? 1 : 0.42;
        const angle = accent.angle + idle * accent.speed + t * 3.2;
        const x = Math.cos(angle) * accent.radius * orbit;
        const y = Math.sin(angle) * accent.radius * 0.55 * orbit - 18 * orbit;
        el.style.opacity = String(orbit * typeBoost);
        el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${angle * 80}deg) scale(${accent.size * lerpMotion(0.6, 1, orbit)})`;
      }

      for (let i = 0; i < motionDots.length; i++) {
        const dot = motionDots[i];
        const el = dotRefs.current[i];
        if (!el) continue;
        const spread = smoothMotion(0.22, 0.55, t) * (1 - finalFan * 0.5);
        const colorProduct = motionProducts[(dot.colorSlot + computedActive) % motionProducts.length];
        const angle = dot.angle + idle * dot.speed + t * 4;
        const x = Math.cos(angle) * dot.radius * spread;
        const y = Math.sin(angle) * dot.radius * 0.74 * spread + dot.lift * spread;
        el.style.setProperty('--dot-color', colorProduct.accent);
        el.style.opacity = String(spread * (0.18 + (dot.id % 4) * 0.1));
        el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${dot.size})`;
      }

      if (visible) rafId = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        const wasVisible = visible;
        visible = entries[0].isIntersecting;
        if (visible && !wasVisible) rafId = requestAnimationFrame(tick);
        else if (!visible && rafId !== null) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      },
      { rootMargin: '100px' },
    );
    io.observe(section);

    return () => {
      io.disconnect();
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  const active = motionProducts[activeIndex];

  return (
    <section ref={sectionRef} id="flavours" className="aura-motion-scroll">
      <div ref={stageRef} className="aura-motion-stage sticky top-0 min-h-screen overflow-hidden text-[#fff7ea]">
        <div className="aura-motion-glow" aria-hidden="true" />
        <div className="aura-motion-ribbon aura-motion-ribbon-a" aria-hidden="true" />
        <div className="aura-motion-ribbon aura-motion-ribbon-b" aria-hidden="true" />
        <div className="aura-motion-dust" aria-hidden="true" />

        <div className="aura-motion-copy">
          <p className="ab-kicker">Motion tasting room</p>
          <h2 className="font-display text-4xl font-extrabold leading-none md:text-6xl">
            Five jars in one flavour storm.
          </h2>
          <p className="mt-5 max-w-md text-sm leading-7 text-[#d8c8b2] md:text-base">
            Scroll through a studio-style crunch moment: lid lift, roasted makhana, flavour energy, then the full AuraBites lineup.
          </p>
          <Link
            to="/shop"
            className="mt-7 inline-flex items-center rounded-full bg-white px-5 py-3 text-sm font-bold text-[#160d09] transition hover:-translate-y-0.5"
          >
            Shop the lineup
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        <div className="aura-motion-label">
          <p>{phase === 'full' ? 'Full lineup' : active.name}</p>
          <span>{phase === 'full' ? 'All flavours ready' : `${active.shortName} energy`}</span>
        </div>

        <div className="aura-motion-scene" aria-hidden="true">
          <div ref={rigRef} className="aura-motion-rig">
            {motionProducts.map((product, index) => (
              <img
                key={product.id}
                ref={(el) => {
                  productRefs.current[index] = el;
                }}
                className="aura-motion-product"
                src={product.image}
                alt=""
                width="760"
                height="1500"
                loading={index === 0 ? 'eager' : 'lazy'}
                decoding="async"
              />
            ))}
          </div>

          <div ref={lidRef} className="aura-motion-lid" />

          {motionMakhana.map((ball, i) => (
            <span
              key={ball.id}
              ref={(el) => {
                makhanaRefs.current[i] = el;
              }}
              className="aura-makhana"
            />
          ))}

          {motionAccents.map((accent, i) => (
            <span
              key={accent.id}
              ref={(el) => {
                accentRefs.current[i] = el;
              }}
              className={`aura-ingredient aura-ingredient-${accent.type}`}
            />
          ))}

          {motionDots.map((dot, i) => (
            <span
              key={dot.id}
              ref={(el) => {
                dotRefs.current[i] = el;
              }}
              className="aura-particle"
            />
          ))}
        </div>

        <div className="aura-motion-floor" aria-hidden="true" />

        <div className="aura-motion-progress" aria-hidden="true">
          {motionProducts.map((product, index) => (
            <span
              key={product.id}
              className={index === activeIndex && phase === 'flavour' ? 'is-active' : ''}
              style={{ '--dot-color': product.accent } as CSSProperties}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// -----------------------------------------------------------------------------
// Top-level: pick mobile carousel or desktop scroll stage
// -----------------------------------------------------------------------------
export const AuraMotionStage = () => {
  // Decided at first render; if user resizes desktop->mobile we don't re-pick.
  // That's intentional — switching mid-session would yank the DOM.
  const useCarousel = useMemo(shouldUseCarousel, []);
  return useCarousel ? <FlavourCarousel /> : <FlavourScrollStage />;
};
