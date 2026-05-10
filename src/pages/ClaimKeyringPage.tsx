import { Helmet } from 'react-helmet-async';
import { Link, useLocation } from 'react-router-dom';
import { Gift, LockKeyhole, PackageCheck, Sparkles } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CartBar } from '@/components/CartBar';
import { CartDrawer } from '@/components/CartDrawer';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const ClaimKeyringPage = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const redirect = encodeURIComponent(`${location.pathname}${location.search}`);

  return (
    <>
      <Helmet>
        <title>Claim Free Named Keyring | AuraBites</title>
        <meta
          name="description"
          content="Claim your free AuraBites named keyring worth Rs 200. Website orders get it automatically; marketplace claim flow is coming soon."
        />
      </Helmet>

      <div className="min-h-screen bg-[#0b0b0c] text-[#fff7ea]">
        <Navbar />
        <main className="relative overflow-hidden pt-28">
          <div className="ab-studio-grain" aria-hidden="true" />
          <section className="container relative z-10 mx-auto px-4 py-20 md:py-28">
            <div className="mx-auto max-w-4xl text-center">
              <p className="ab-kicker">Free named keyring</p>
              <h1 className="font-display text-5xl font-extrabold leading-none md:text-7xl">
                A tiny custom gift, packed with your crunch.
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[#d6c7b4] md:text-lg">
                Every AuraBites website order gets a free named keyring worth Rs 200. Marketplace buyers will soon be able to verify an order and claim one here.
              </p>
            </div>

            <div className="mx-auto mt-12 grid max-w-5xl gap-5 md:grid-cols-3">
              <div className="ab-claim-card">
                <Gift className="h-8 w-8 text-[#ffb47a]" />
                <h2 className="font-display text-2xl font-extrabold">Website orders</h2>
                <p>Enter the name during checkout and we will include the keyring in your box.</p>
              </div>
              <div className="ab-claim-card">
                <PackageCheck className="h-8 w-8 text-[#a8ddb1]" />
                <h2 className="font-display text-2xl font-extrabold">Marketplace orders</h2>
                <p>Claim flow is opening soon after backend verification is connected.</p>
              </div>
              <div className="ab-claim-card">
                <Sparkles className="h-8 w-8 text-[#f5c8d2]" />
                <h2 className="font-display text-2xl font-extrabold">Worth Rs 200</h2>
                <p>A custom AuraBites keyring with your name, made as a snack-shelf keepsake.</p>
              </div>
            </div>

            <div className="mx-auto mt-10 max-w-2xl rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 text-center shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-md md:p-8">
              {isLoading ? (
                <p className="text-[#d6c7b4]">Checking your account...</p>
              ) : user ? (
                <>
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#ffb47a]">
                    Hi {user.name?.split(' ')[0] || 'there'}
                  </p>
                  <h2 className="mt-3 font-display text-3xl font-extrabold">
                    Marketplace claims are coming soon.
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-[#d6c7b4]">
                    Once the backend claim flow is ready, this page will collect marketplace order proof and your keyring name.
                  </p>
                  <Link to="/shop" className="mt-6 inline-block">
                    <Button className="rounded-full bg-white px-7 font-bold text-[#160d09] hover:bg-[#f7efe2]">
                      Shop AuraBites now
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <LockKeyhole className="mx-auto h-10 w-10 text-[#ffb47a]" />
                  <h2 className="mt-4 font-display text-3xl font-extrabold">
                    Login to claim marketplace gifts.
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-[#d6c7b4]">
                    Website orders can claim during checkout. Marketplace claims will require login when verification is live.
                  </p>
                  <Link to={`/login?redirect=${redirect}`} className="mt-6 inline-block">
                    <Button className="rounded-full bg-white px-7 font-bold text-[#160d09] hover:bg-[#f7efe2]">
                      Login to continue
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </section>
        </main>
        <Footer />
        <CartBar />
        <CartDrawer />
      </div>
    </>
  );
};

export default ClaimKeyringPage;
