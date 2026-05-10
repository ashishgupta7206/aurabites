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
  const rafRef = useRef<number | null>(null);
  const [frame, setFrame] = useState({ t: 0, idle: 0, reduced: false });

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced) {
      setFrame({ t: 1, idle: 0, reduced: true });
      return;
    }

    const startedAt = performance.now();
    const tick = (now: number) => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const maxScroll = Math.max(section.offsetHeight - window.innerHeight, 1);
      const t = clampMotion(-rect.top / maxScroll);
      const idle = (now - startedAt) / 1000;
      setFrame({ t, idle, reduced: false });
      rafRef.current = window.requestAnimationFrame(tick);
    };

    rafRef.current = window.requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const activeIndex = useMemo(() => {
    const scores = productCenters.map((center) => windowPeak(frame.t, center, 0.13));
    const best = scores.reduce((winner, score, index) => (score > scores[winner] ? index : winner), 0);
    return frame.t > 0.84 ? 0 : best;
  }, [frame.t]);

  const active = motionProducts[activeIndex];
  const lidLift = smoothMotion(0.1, 0.29, frame.t) * (1 - smoothMotion(0.78, 0.94, frame.t));
  const flavourEnergy = smoothMotion(0.26, 0.55, frame.t) * (1 - smoothMotion(0.86, 1, frame.t));
  const finalFan = smoothMotion(0.78, 0.96, frame.t);
  const intro = smoothMotion(0, 0.18, frame.t);
  const stagePulse = Math.sin(frame.idle * 1.4) * 0.5 + 0.5;

  const stageStyle =
    {
      '--motion-accent': active.accent,
      '--motion-soft': active.accentSoft,
      '--motion-energy': flavourEnergy,
      '--motion-fan': finalFan,
      '--motion-pulse': stagePulse,
    } as CSSProperties;

  const rigScale = lerpMotion(0.82, 1.06, intro) + Math.sin(frame.idle * 1.7) * 0.015;
  const rigY = lerpMotion(92, -12, intro) + Math.sin(frame.idle * 1.25) * 9 - lidLift * 18 + finalFan * 20;
  const rigX = Math.sin(frame.t * Math.PI * 4 + frame.idle * 0.45) * 18 * flavourEnergy * (1 - finalFan);
  const rigR = lerpMotion(-5, 0, intro) + Math.sin(frame.idle * 0.9) * 1.2 + flavourEnergy * Math.sin(frame.t * 22) * 1.6;

  return (
    <section ref={sectionRef} id="flavours" className="aura-motion-scroll" style={stageStyle}>
      <div className="aura-motion-stage sticky top-0 min-h-screen overflow-hidden text-[#fff7ea]">
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
          <p>{finalFan > 0.65 ? 'Full lineup' : active.name}</p>
          <span>{finalFan > 0.65 ? 'All flavours ready' : `${active.shortName} energy`}</span>
        </div>

        <div className="aura-motion-scene" aria-hidden="true">
          <div
            className="aura-motion-rig"
            style={{
              transform: `translate3d(${rigX}px, ${rigY}px, 0) rotate(${rigR}deg) scale(${rigScale})`,
            }}
          >
            {motionProducts.map((product, index) => {
              const productPeak = windowPeak(frame.t, productCenters[index], 0.14);
              const introPresence = index === 0 ? 1 - smoothMotion(0.16, 0.31, frame.t) : 0;
              const activeOpacity = Math.max(productPeak, introPresence) * (1 - finalFan);
              const finalOpacity = finalFan * (index === 0 ? 1 : 0.82);
              const opacity = Math.max(activeOpacity, finalOpacity);
              const drift = Math.sin(frame.idle * 1.1 + index) * 9 * productPeak * (1 - finalFan);
              const x = product.finalX * finalFan + drift;
              const y = product.finalY * finalFan + Math.sin(frame.idle * 1.25 + index) * 7 * (activeOpacity + finalFan * 0.25);
              const rotate = product.finalRotate * finalFan + Math.sin(frame.idle * 0.7 + index) * 1.1 * activeOpacity;
              const scale = lerpMotion(1, product.finalScale, finalFan) * lerpMotion(0.94, 1.02, activeOpacity);

              return (
                <img
                  key={product.id}
                  className="aura-motion-product"
                  src={product.image}
                  alt=""
                  width="760"
                  height="1500"
                  style={
                    {
                      opacity,
                      transform: `translate3d(${x}px, ${y}px, 0) rotate(${rotate}deg) scale(${scale})`,
                      zIndex: Math.round(80 + opacity * 100 - Math.abs(product.finalX) * finalFan * 0.08),
                    } as CSSProperties
                  }
                />
              );
            })}
          </div>

          <div
            className="aura-motion-lid"
            style={{
              opacity: smoothMotion(0.04, 0.16, frame.t) * (1 - finalFan),
              transform: `translate(-50%, -50%) translate3d(${lidLift * 70 + Math.sin(frame.idle * 2) * 10}px, ${120 - lidLift * 260 + finalFan * 90}px, 0) rotate(${-8 + lidLift * 48 + frame.t * 140}deg) scale(${0.82 + lidLift * 0.2})`,
            }}
          />

          {motionMakhana.map((ball) => {
            const pop = smoothMotion(0.13 + ball.delay, 0.36 + ball.delay, frame.t);
            const settle = smoothMotion(0.72, 0.96, frame.t);
            const air = Math.sin(clampMotion((frame.t - 0.13 - ball.delay) / 0.54) * Math.PI);
            const angle = ball.angle + frame.idle * 0.18 + frame.t * 2.1;
            const x = Math.cos(angle) * ball.radius * pop * (1 - settle * 0.35);
            const y = 40 + Math.sin(angle) * ball.radius * 0.32 * pop - air * 210 + settle * 130;
            const opacity = pop * (1 - settle * 0.55);
            return (
              <span
                key={ball.id}
                className="aura-makhana"
                style={
                  {
                    opacity,
                    transform: `translate3d(${x}px, ${y}px, 0) rotate(${ball.spin * frame.t + frame.idle * 18}deg) scale(${ball.size * lerpMotion(0.42, 1, pop)})`,
                  } as CSSProperties
                }
              />
            );
          })}

          {motionAccents.map((accent) => {
            const orbit = smoothMotion(0.3, 0.58, frame.t) * (1 - finalFan * 0.7);
            const typeBoost = active.ingredient === accent.type ? 1 : 0.42;
            const angle = accent.angle + frame.idle * accent.speed + frame.t * 3.2;
            const x = Math.cos(angle) * accent.radius * orbit;
            const y = Math.sin(angle) * accent.radius * 0.55 * orbit - 18 * orbit;
            return (
              <span
                key={accent.id}
                className={`aura-ingredient aura-ingredient-${accent.type}`}
                style={
                  {
                    opacity: orbit * typeBoost,
                    transform: `translate3d(${x}px, ${y}px, 0) rotate(${angle * 80}deg) scale(${accent.size * lerpMotion(0.6, 1, orbit)})`,
                  } as CSSProperties
                }
              />
            );
          })}

          {motionDots.map((dot) => {
            const spread = smoothMotion(0.22, 0.55, frame.t) * (1 - finalFan * 0.5);
            const colorProduct = motionProducts[(dot.colorSlot + activeIndex) % motionProducts.length];
            const angle = dot.angle + frame.idle * dot.speed + frame.t * 4;
            const x = Math.cos(angle) * dot.radius * spread;
            const y = Math.sin(angle) * dot.radius * 0.74 * spread + dot.lift * spread;
            return (
              <span
                key={dot.id}
                className="aura-particle"
                style={
                  {
                    '--dot-color': colorProduct.accent,
                    opacity: spread * (0.18 + (dot.id % 4) * 0.1),
                    transform: `translate3d(${x}px, ${y}px, 0) scale(${dot.size})`,
                  } as CSSProperties
                }
              />
            );
          })}
        </div>

        <div className="aura-motion-floor" aria-hidden="true" />

        <div className="aura-motion-progress" aria-hidden="true">
          {motionProducts.map((product, index) => (
            <span
              key={product.id}
              className={index === activeIndex && finalFan < 0.65 ? 'is-active' : ''}
              style={{ '--dot-color': product.accent } as CSSProperties}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
