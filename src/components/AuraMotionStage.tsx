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

export const AuraMotionStage = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const rigRef = useRef<HTMLDivElement | null>(null);
  const lidRef = useRef<HTMLDivElement | null>(null);
  const productRefs = useRef<(HTMLImageElement | null)[]>([]);
  const makhanaRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const accentRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // Only state we update during scroll — and only when it CHANGES, not every frame
  const [activeIndex, setActiveIndex] = useState(0);
  const [phase, setPhase] = useState<'flavour' | 'full'>('flavour');
  const [reduced, setReduced] = useState(false);

  // Detect mobile once — cut particle count dramatically
  const isMobile = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches,
    [],
  );
  const dots = useMemo(() => (isMobile ? motionDots.slice(0, 24) : motionDots), [isMobile]);
  const accents = useMemo(() => (isMobile ? motionAccents.slice(0, 10) : motionAccents), [isMobile]);
  const makhana = useMemo(() => (isMobile ? motionMakhana.slice(0, 8) : motionMakhana), [isMobile]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setReduced(true);
      return;
    }

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

      // Determine active product (cheap)
      const scores = productCenters.map((c) => windowPeak(t, c, 0.13));
      let best = 0;
      for (let i = 1; i < scores.length; i++) if (scores[i] > scores[best]) best = i;
      const computedActive = t > 0.84 ? 0 : best;
      const currentPhase: 'flavour' | 'full' = t > 0.84 ? 'full' : 'flavour';

      // Only setState when something user-visible CHANGES (label text, progress dot)
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

      // Stage CSS variables — single element, no re-render
      const stage = stageRef.current;
      if (stage) {
        const s = stage.style;
        s.setProperty('--motion-accent', active.accent);
        s.setProperty('--motion-soft', active.accentSoft);
        s.setProperty('--motion-energy', String(flavourEnergy));
        s.setProperty('--motion-fan', String(finalFan));
        s.setProperty('--motion-pulse', String(stagePulse));
      }

      // Rig — single element transform
      const rigScale = lerpMotion(0.82, 1.06, intro) + Math.sin(idle * 1.7) * 0.015;
      const rigY = lerpMotion(92, -12, intro) + Math.sin(idle * 1.25) * 9 - lidLift * 18 + finalFan * 20;
      const rigX = Math.sin(t * Math.PI * 4 + idle * 0.45) * 18 * flavourEnergy * (1 - finalFan);
      const rigR = lerpMotion(-5, 0, intro) + Math.sin(idle * 0.9) * 1.2 + flavourEnergy * Math.sin(t * 22) * 1.6;
      const rig = rigRef.current;
      if (rig) {
        rig.style.transform = `translate3d(${rigX}px, ${rigY}px, 0) rotate(${rigR}deg) scale(${rigScale})`;
      }

      // Products — direct ref mutation
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

      // Lid
      const lid = lidRef.current;
      if (lid) {
        lid.style.opacity = String(smoothMotion(0.04, 0.16, t) * (1 - finalFan));
        lid.style.transform = `translate(-50%, -50%) translate3d(${lidLift * 70 + Math.sin(idle * 2) * 10}px, ${120 - lidLift * 260 + finalFan * 90}px, 0) rotate(${-8 + lidLift * 48 + t * 140}deg) scale(${0.82 + lidLift * 0.2})`;
      }

      // Makhana
      for (let i = 0; i < makhana.length; i++) {
        const ball = makhana[i];
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

      // Accents
      for (let i = 0; i < accents.length; i++) {
        const accent = accents[i];
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

      // Dots
      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];
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

      if (visible) {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    // Pause animation when section is off-screen — huge battery + perf win
    const io = new IntersectionObserver(
      (entries) => {
        const wasVisible = visible;
        visible = entries[0].isIntersecting;
        if (visible && !wasVisible) {
          rafId = window.requestAnimationFrame(tick);
        } else if (!visible && rafId !== null) {
          window.cancelAnimationFrame(rafId);
          rafId = null;
        }
      },
      { rootMargin: '100px' },
    );
    io.observe(section);

    return () => {
      io.disconnect();
      if (rafId !== null) window.cancelAnimationFrame(rafId);
    };
  }, [dots, accents, makhana]);

  const active = motionProducts[activeIndex];

  // Reduced-motion users get a static final layout — no animation, no RAF
  if (reduced) {
    return (
      <section ref={sectionRef} id="flavours" className="aura-motion-scroll">
        <div className="aura-motion-stage sticky top-0 min-h-screen overflow-hidden text-[#fff7ea]">
          <div className="aura-motion-copy">
            <p className="ab-kicker">Our flavours</p>
            <h2 className="font-display text-4xl font-extrabold leading-none md:text-6xl">
              Five jars in one flavour storm.
            </h2>
            <Link
              to="/shop"
              className="mt-7 inline-flex items-center rounded-full bg-white px-5 py-3 text-sm font-bold text-[#160d09]"
            >
              Shop the lineup
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          <div className="aura-motion-scene" aria-hidden="true">
            {motionProducts.map((product) => (
              <img key={product.id} className="aura-motion-product" src={product.image} alt="" loading="lazy" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} id="flavours" className="aura-motion-scroll">
      <div
        ref={stageRef}
        className="aura-motion-stage sticky top-0 min-h-screen overflow-hidden text-[#fff7ea]"
      >
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

          {makhana.map((ball, i) => (
            <span
              key={ball.id}
              ref={(el) => {
                makhanaRefs.current[i] = el;
              }}
              className="aura-makhana"
            />
          ))}

          {accents.map((accent, i) => (
            <span
              key={accent.id}
              ref={(el) => {
                accentRefs.current[i] = el;
              }}
              className={`aura-ingredient aura-ingredient-${accent.type}`}
            />
          ))}

          {dots.map((dot, i) => (
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
