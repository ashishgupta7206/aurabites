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

// Detect device tier once, before render.
// Policy: any mobile-sized viewport (<=768px) gets the static fallback —
// the scroll-driven animation is desktop-only. Premium e-commerce sites
// (Apple, Allbirds, Nike) all give phone users a simpler, faster layout.
const detectTier = (): 'low' | 'mobile' | 'desktop' => {
  if (typeof window === 'undefined') return 'desktop';
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'low';
  if (window.matchMedia('(max-width: 768px)').matches) return 'low';
  return 'desktop';
};

export const AuraMotionStage = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const rigRef = useRef<HTMLDivElement | null>(null);
  const lidRef = useRef<HTMLDivElement | null>(null);
  const productRefs = useRef<(HTMLImageElement | null)[]>([]);
  const makhanaRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const accentRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // Tier decided ONCE — no re-detection
  const tier = useMemo(detectTier, []);

  // Only update React state on rare, user-visible changes
  const [activeIndex, setActiveIndex] = useState(0);
  const [phase, setPhase] = useState<'flavour' | 'full'>('flavour');

  // Particle counts — way fewer on mobile, none for low-end (it renders static fallback anyway)
  const dots = useMemo(
    () => (tier === 'desktop' ? motionDots : tier === 'mobile' ? motionDots.slice(0, 8) : []),
    [tier],
  );
  const accents = useMemo(
    () => (tier === 'desktop' ? motionAccents : tier === 'mobile' ? [] : []),
    [tier],
  );
  const makhana = useMemo(
    () => (tier === 'desktop' ? motionMakhana : tier === 'mobile' ? motionMakhana.slice(0, 4) : []),
    [tier],
  );

  useEffect(() => {
    if (tier === 'low') return; // low-end renders static layout below — no RAF, no listeners

    const section = sectionRef.current;
    if (!section) return;

    const isMobile = tier === 'mobile';
    let rafScheduled = false;
    let visible = false;
    let lastActiveIdx = -1;
    let lastPhase: 'flavour' | 'full' | null = null;
    const startedAt = performance.now();

    const update = (now: number) => {
      rafScheduled = false;
      const rect = section.getBoundingClientRect();
      const maxScroll = Math.max(section.offsetHeight - window.innerHeight, 1);
      const t = clampMotion(-rect.top / maxScroll);
      // Mobile: zero out idle animation entirely (saves continuous repaint)
      const idle = isMobile ? 0 : (now - startedAt) / 1000;

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
      const stagePulse = isMobile ? 0.5 : Math.sin(idle * 1.4) * 0.5 + 0.5;

      const stage = stageRef.current;
      if (stage) {
        const s = stage.style;
        s.setProperty('--motion-accent', active.accent);
        s.setProperty('--motion-soft', active.accentSoft);
        s.setProperty('--motion-energy', String(flavourEnergy));
        s.setProperty('--motion-fan', String(finalFan));
        s.setProperty('--motion-pulse', String(stagePulse));
      }

      // Rig — no idle wobble on mobile
      const rigScale = lerpMotion(0.82, 1.06, intro);
      const rigY = lerpMotion(92, -12, intro) - lidLift * 18 + finalFan * 20;
      const rigX = isMobile ? 0 : Math.sin(t * Math.PI * 4) * 18 * flavourEnergy * (1 - finalFan);
      const rigR = lerpMotion(-5, 0, intro) + (isMobile ? 0 : flavourEnergy * Math.sin(t * 22) * 1.6);
      const rig = rigRef.current;
      if (rig) {
        rig.style.transform = `translate3d(${rigX}px, ${rigY}px, 0) rotate(${rigR}deg) scale(${rigScale})`;
      }

      // Products
      for (let i = 0; i < motionProducts.length; i++) {
        const product = motionProducts[i];
        const el = productRefs.current[i];
        if (!el) continue;
        const productPeak = windowPeak(t, productCenters[i], 0.14);
        const introPresence = i === 0 ? 1 - smoothMotion(0.16, 0.31, t) : 0;
        const activeOpacity = Math.max(productPeak, introPresence) * (1 - finalFan);
        const finalOpacity = finalFan * (i === 0 ? 1 : 0.82);
        const opacity = Math.max(activeOpacity, finalOpacity);
        const x = product.finalX * finalFan;
        const y = product.finalY * finalFan;
        const rotate = product.finalRotate * finalFan;
        const scale = lerpMotion(1, product.finalScale, finalFan) * lerpMotion(0.94, 1.02, activeOpacity);
        el.style.opacity = String(opacity);
        el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rotate}deg) scale(${scale})`;
        el.style.zIndex = String(Math.round(80 + opacity * 100));
      }

      // Lid — only on desktop, hide entirely on mobile
      const lid = lidRef.current;
      if (lid && !isMobile) {
        lid.style.opacity = String(smoothMotion(0.04, 0.16, t) * (1 - finalFan));
        lid.style.transform = `translate(-50%, -50%) translate3d(${lidLift * 70}px, ${120 - lidLift * 260 + finalFan * 90}px, 0) rotate(${-8 + lidLift * 48 + t * 140}deg) scale(${0.82 + lidLift * 0.2})`;
      }

      // Makhana
      for (let i = 0; i < makhana.length; i++) {
        const ball = makhana[i];
        const el = makhanaRefs.current[i];
        if (!el) continue;
        const pop = smoothMotion(0.13 + ball.delay, 0.36 + ball.delay, t);
        const settle = smoothMotion(0.72, 0.96, t);
        const air = Math.sin(clampMotion((t - 0.13 - ball.delay) / 0.54) * Math.PI);
        const angle = ball.angle + t * 2.1;
        const x = Math.cos(angle) * ball.radius * pop * (1 - settle * 0.35);
        const y = 40 + Math.sin(angle) * ball.radius * 0.32 * pop - air * 210 + settle * 130;
        el.style.opacity = String(pop * (1 - settle * 0.55));
        el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${ball.spin * t}deg) scale(${ball.size * lerpMotion(0.42, 1, pop)})`;
      }

      // Accents — desktop only
      if (!isMobile) {
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
      }

      // Dots
      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];
        const el = dotRefs.current[i];
        if (!el) continue;
        const spread = smoothMotion(0.22, 0.55, t) * (1 - finalFan * 0.5);
        const colorProduct = motionProducts[(dot.colorSlot + computedActive) % motionProducts.length];
        const angle = dot.angle + (isMobile ? 0 : idle * dot.speed) + t * 4;
        const x = Math.cos(angle) * dot.radius * spread;
        const y = Math.sin(angle) * dot.radius * 0.74 * spread + dot.lift * spread;
        el.style.setProperty('--dot-color', colorProduct.accent);
        el.style.opacity = String(spread * (0.18 + (dot.id % 4) * 0.1));
        el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${dot.size})`;
      }
    };

    const scheduleUpdate = () => {
      if (rafScheduled || !visible) return;
      rafScheduled = true;
      requestAnimationFrame(update);
    };

    // Desktop: continuous RAF for idle animations
    // Mobile: scroll-driven only — no continuous loop
    const desktopTick = (now: number) => {
      rafScheduled = false;
      update(now);
      if (visible) {
        rafScheduled = true;
        requestAnimationFrame(desktopTick);
      }
    };

    const onScroll = () => scheduleUpdate();

    const io = new IntersectionObserver(
      (entries) => {
        const wasVisible = visible;
        visible = entries[0].isIntersecting;
        if (visible && !wasVisible) {
          if (isMobile) {
            // mobile: just paint once + listen for scroll
            scheduleUpdate();
            window.addEventListener('scroll', onScroll, { passive: true });
          } else {
            // desktop: kick off the idle RAF loop
            rafScheduled = true;
            requestAnimationFrame(desktopTick);
          }
        } else if (!visible && wasVisible) {
          if (isMobile) window.removeEventListener('scroll', onScroll);
          // desktop loop stops on next tick (visible flag is false)
        }
      },
      { rootMargin: '100px' },
    );
    io.observe(section);

    return () => {
      io.disconnect();
      if (isMobile) window.removeEventListener('scroll', onScroll);
    };
  }, [dots, accents, makhana, tier]);

  const active = motionProducts[activeIndex];

  // Low-end devices: static layout, no JS animation at all
  if (tier === 'low') {
    return (
      <section ref={sectionRef} id="flavours" className="aura-motion-static py-16">
        <div className="mx-auto max-w-5xl px-5 text-center text-[#160d09]">
          <p className="ab-kicker">Our flavours</p>
          <h2 className="font-display text-3xl font-extrabold leading-tight md:text-5xl">
            Five jars in one flavour storm.
          </h2>
          <p className="mt-4 text-sm leading-7 text-[#5a4836] md:text-base">
            Crunchy, roasted makhana in five bold flavours.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {motionProducts.map((product) => (
              <div key={product.id} className="aura-motion-static-card">
                <img src={product.image} alt={product.name} loading="lazy" decoding="async" />
                <p>{product.shortName}</p>
              </div>
            ))}
          </div>
          <Link
            to="/shop"
            className="mt-8 inline-flex items-center rounded-full bg-[#160d09] px-5 py-3 text-sm font-bold text-white"
          >
            Shop the lineup
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>
    );
  }

  const isMobile = tier === 'mobile';

  return (
    <section ref={sectionRef} id="flavours" className="aura-motion-scroll">
      <div
        ref={stageRef}
        className={`aura-motion-stage sticky top-0 min-h-screen overflow-hidden text-[#fff7ea]${isMobile ? ' is-mobile' : ''}`}
      >
        {!isMobile && <div className="aura-motion-glow" aria-hidden="true" />}
        {!isMobile && <div className="aura-motion-ribbon aura-motion-ribbon-a" aria-hidden="true" />}
        {!isMobile && <div className="aura-motion-ribbon aura-motion-ribbon-b" aria-hidden="true" />}
        {!isMobile && <div className="aura-motion-dust" aria-hidden="true" />}

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

          {!isMobile && <div ref={lidRef} className="aura-motion-lid" />}

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

        {!isMobile && <div className="aura-motion-floor" aria-hidden="true" />}

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
