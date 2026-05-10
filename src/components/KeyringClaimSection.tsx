import { useEffect, useMemo, useState } from 'react';
import { Gift, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { KEYRING_STORAGE_KEY, sanitizeKeyringName } from '@/lib/keyring';

export const KeyringClaimSection = () => {
  const [name, setName] = useState(() => {
    if (typeof window === 'undefined') return 'YOUR NAME';
    return localStorage.getItem(KEYRING_STORAGE_KEY) || 'YOUR NAME';
  });

  const displayName = useMemo(() => sanitizeKeyringName(name) || 'YOUR NAME', [name]);
  const fontSize = Math.max(26, Math.min(58, Math.round(430 / displayName.length)));

  useEffect(() => {
    if (displayName !== 'YOUR NAME') {
      localStorage.setItem(KEYRING_STORAGE_KEY, displayName);
    }
  }, [displayName]);

  return (
    <section id="free-keyring" className="ab-section bg-[#f8f0df] text-[#24150d]">
      <div className="container mx-auto grid gap-12 px-4 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div>
          <p className="ab-kicker text-[#9a3b18]">Free named keyring</p>
          <h2 className="font-display text-4xl font-extrabold leading-tight md:text-6xl">
            Claim your free named keyring worth Rs 200.
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-8 text-[#6f5b4d]">
            Every website order gets a custom AuraBites keyring with your name on it. Pick your crunch, type the name, and we will pack the gift with your order.
          </p>

          <div className="mt-8 max-w-md">
            <label htmlFor="keyring-name" className="text-sm font-bold text-[#3b2518]">
              Name on keyring
            </label>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <input
                id="keyring-name"
                value={name}
                maxLength={10}
                onFocus={() => name === 'YOUR NAME' && setName('')}
                onChange={(event) => setName(sanitizeKeyringName(event.target.value))}
                className="h-12 flex-1 rounded-full border border-[#d8c6ac] bg-white/70 px-5 text-sm font-semibold outline-none transition focus:border-[#9a3b18] focus:ring-4 focus:ring-[#9a3b18]/10"
                placeholder="Max 10 chars"
              />
              <Link to="/shop">
                <Button className="h-12 w-full rounded-full bg-[#1d120d] px-6 font-bold text-white hover:bg-[#3b2518] sm:w-auto">
                  Shop to claim
                </Button>
              </Link>
            </div>
            <p className="mt-3 text-xs font-medium text-[#7b6755]">
              If left blank at checkout, we will use your first name.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-bold text-[#7c2a12]">
              <Gift className="h-4 w-4" />
              Worth Rs 200
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-bold text-[#41691e]">
              <Sparkles className="h-4 w-4" />
              Free with every order
            </span>
          </div>
        </div>

        <div className="ab-keyring-card">
          <div className="ab-keyring-card-tag">Personalized gift</div>
          <svg className="ab-keyring-svg" viewBox="0 0 420 420" role="img" aria-label={`Preview keyring with name ${displayName}`}>
            <defs>
              <radialGradient id="keyringGlow" cx="35%" cy="30%">
                <stop offset="0%" stopColor="#fff8e8" />
                <stop offset="58%" stopColor="#e9d3aa" />
                <stop offset="100%" stopColor="#a87a43" />
              </radialGradient>
              <filter id="keyringShadow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="18" stdDeviation="18" floodColor="#4b2c16" floodOpacity="0.28" />
              </filter>
            </defs>
            <circle cx="210" cy="78" r="30" fill="none" stroke="#c7aa7c" strokeWidth="9" />
            <line x1="210" y1="108" x2="210" y2="145" stroke="#c7aa7c" strokeWidth="5" strokeLinecap="round" />
            <path
              d="M210 142c65 0 122 51 122 118 0 72-53 122-122 122S88 332 88 260c0-67 57-118 122-118Z"
              fill="url(#keyringGlow)"
              stroke="#8d6332"
              strokeWidth="3"
              filter="url(#keyringShadow)"
            />
            <path d="M151 218c18-28 62-38 101-18" fill="none" stroke="#fff4d5" strokeWidth="9" strokeLinecap="round" opacity="0.55" />
            <text
              x="210"
              y="278"
              textAnchor="middle"
              fontFamily="Nunito, sans-serif"
              fontWeight="900"
              fontSize={fontSize}
              fill="#58340f"
            >
              {displayName}
            </text>
          </svg>
        </div>
      </div>
    </section>
  );
};
