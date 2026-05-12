import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useSearchParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { CheckCircle2, Gift, Loader2, PackageCheck, Sparkles, TicketCheck, Truck } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CartBar } from '@/components/CartBar';
import { CartDrawer } from '@/components/CartDrawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { KEYRING_STORAGE_KEY, sanitizeKeyringName } from '@/lib/keyring';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

type ClaimForm = {
  code: string;
  freeGiftName: string;
  customerName: string;
  customerEmail: string;
  customerMobile: string;
  addressLine1: string;
  addressLine2: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  marketplaceOrderRef: string;
};

type ClaimResult = {
  code: string;
  freeGiftName?: string;
  status: string;
  claimUrl?: string;
};

const normalizeCode = (value: string) => value.toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 40);

const getErrorMessage = (error: unknown, fallback: string) => {
  return error instanceof Error ? error.message : fallback;
};

const initialStoredName = () => {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(KEYRING_STORAGE_KEY) || '';
};

const ClaimKeyringPage = () => {
  const { user, isLoading } = useAuth();
  const [searchParams] = useSearchParams();
  const queryCode = searchParams.get('code') || '';
  const [form, setForm] = useState<ClaimForm>({
    code: normalizeCode(queryCode),
    freeGiftName: sanitizeKeyringName(initialStoredName()),
    customerName: '',
    customerEmail: '',
    customerMobile: '',
    addressLine1: '',
    addressLine2: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
    marketplaceOrderRef: '',
  });
  const [codeStatus, setCodeStatus] = useState<'idle' | 'checking' | 'valid' | 'invalid'>('idle');
  const [codeMessage, setCodeMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<ClaimResult | null>(null);

  const displayName = useMemo(() => {
    return sanitizeKeyringName(form.freeGiftName) || sanitizeKeyringName(form.customerName.split(' ')[0] || '') || 'YOUR NAME';
  }, [form.freeGiftName, form.customerName]);

  useEffect(() => {
    if (!user) return;
    setForm((current) => ({
      ...current,
      customerName: current.customerName || user.name || '',
      customerEmail: current.customerEmail || user.email || '',
      customerMobile: current.customerMobile || user.mobileNumber || '',
    }));
  }, [user]);

  useEffect(() => {
    const code = normalizeCode(queryCode);
    if (!code) return;
    setForm((current) => ({ ...current, code }));

    const checkCode = async () => {
      setCodeStatus('checking');
      setCodeMessage('');
      try {
        const response = await fetch(`${API_BASE_URL}/free-gifts/codes/${encodeURIComponent(code)}`);
        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.message || 'This claim code is not valid');
        }
        setCodeStatus('valid');
        setCodeMessage('Code verified. Fill the details to claim your keyring.');
      } catch (error: unknown) {
        setCodeStatus('invalid');
        setCodeMessage(getErrorMessage(error, 'This claim code is not valid'));
      }
    };

    void checkCode();
  }, [queryCode]);

  const setField = (field: keyof ClaimForm, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: field === 'code'
        ? normalizeCode(value)
        : field === 'freeGiftName'
          ? sanitizeKeyringName(value)
          : value,
    }));
    if (field === 'code') {
      setCodeStatus('idle');
      setCodeMessage('');
    }
  };

  const validateCode = async () => {
    const code = normalizeCode(form.code);
    if (!code) {
      toast.error('Enter your claim code');
      return false;
    }

    setCodeStatus('checking');
    setCodeMessage('');
    try {
      const response = await fetch(`${API_BASE_URL}/free-gifts/codes/${encodeURIComponent(code)}`);
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'This claim code is not valid');
      }
      setCodeStatus('valid');
      setCodeMessage('Code verified. Fill the details to claim your keyring.');
      return true;
    } catch (error: unknown) {
      setCodeStatus('invalid');
      setCodeMessage(getErrorMessage(error, 'This claim code is not valid'));
      return false;
    }
  };

  const claimGift = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      const isCodeValid = codeStatus === 'valid' || (await validateCode());
      if (!isCodeValid) return;

      const token = Cookies.get('token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const payload = {
        ...form,
        code: normalizeCode(form.code),
        freeGiftName: sanitizeKeyringName(displayName),
      };

      const response = await fetch(`${API_BASE_URL}/free-gifts/claims`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Could not claim this gift');
      }

      localStorage.setItem(KEYRING_STORAGE_KEY, payload.freeGiftName);
      setResult(data.data);
      setCodeStatus('valid');
      toast.success('Free keyring claimed successfully');
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, 'Could not claim this gift'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Claim Free Named Keyring | AuraBites</title>
        <meta
          name="description"
          content="Claim your free AuraBites named keyring with a marketplace claim code or get it automatically with every website order."
        />
      </Helmet>

      <div className="min-h-screen bg-[#0b0b0c] text-[#fff7ea]">
        <Navbar />
        <main className="relative overflow-hidden pt-28">
          <div className="ab-studio-grain" aria-hidden="true" />
          <section className="container relative z-10 mx-auto px-4 py-16 md:py-24">
            <div className="mx-auto max-w-4xl text-center">
              <p className="ab-kicker">Free named keyring</p>
              <h1 className="font-display text-5xl font-extrabold leading-none md:text-7xl">
                Claim the gift inside your AuraBites delivery.
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[#d6c7b4] md:text-lg">
                Website orders get the gift during checkout. Marketplace buyers can use the unique code printed inside the delivery pack to claim a custom keyring worth Rs 200.
              </p>
            </div>

            <div className="mx-auto mt-12 grid max-w-5xl gap-5 md:grid-cols-3">
              <div className="ab-claim-card">
                <TicketCheck className="h-8 w-8 text-[#ffb47a]" />
                <h2 className="font-display text-2xl font-extrabold">Find the code</h2>
                <p>Each marketplace order can carry one unique AuraBites claim code.</p>
              </div>
              <div className="ab-claim-card">
                <Gift className="h-8 w-8 text-[#f5c8d2]" />
                <h2 className="font-display text-2xl font-extrabold">Name it</h2>
                <p>Add up to 10 letters, numbers or spaces for the keyring.</p>
              </div>
              <div className="ab-claim-card">
                <Truck className="h-8 w-8 text-[#a8ddb1]" />
                <h2 className="font-display text-2xl font-extrabold">We fulfill it</h2>
                <p>Your claim is stored for packing and dispatch by the AuraBites team.</p>
              </div>
            </div>

            <div className="mx-auto mt-12 grid max-w-6xl gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
              <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-md md:p-8">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#ffb47a]">
                  Live preview
                </p>
                <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-[#f8f0df] p-6 text-[#24150d]">
                  <div className="mx-auto flex aspect-square max-w-[320px] items-center justify-center rounded-full bg-[radial-gradient(circle_at_35%_25%,#fff8e8,#e8c98f_58%,#a87a43)] shadow-[0_28px_70px_rgba(0,0,0,0.35)]">
                    <span className="max-w-[82%] break-words text-center font-display text-4xl font-black leading-none text-[#573410] md:text-5xl">
                      {displayName}
                    </span>
                  </div>
                  <p className="mt-5 text-center text-sm font-semibold text-[#6f5b4d]">
                    Free named keyring worth Rs 200
                  </p>
                </div>

                <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-5">
                  <h2 className="font-display text-2xl font-extrabold">For website orders</h2>
                  <p className="mt-3 text-sm leading-7 text-[#d6c7b4]">
                    You do not need a code. Add your keyring name at checkout and the gift is added automatically.
                  </p>
                  <Link to="/shop" className="mt-5 inline-block">
                    <Button className="rounded-full bg-white px-7 font-bold text-[#160d09] hover:bg-[#f7efe2]">
                      Shop AuraBites
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-md md:p-8">
                {result ? (
                  <div className="py-8 text-center">
                    <CheckCircle2 className="mx-auto h-14 w-14 text-[#a8ddb1]" />
                    <h2 className="mt-5 font-display text-4xl font-extrabold">
                      Your keyring claim is locked in.
                    </h2>
                    <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#d6c7b4]">
                      Code {result.code} has been claimed for {result.freeGiftName || displayName}. The AuraBites team will use your submitted details for fulfillment.
                    </p>
                    <Link to="/shop" className="mt-7 inline-block">
                      <Button className="rounded-full bg-[#ffb47a] px-7 font-bold text-[#160d09] hover:bg-[#ffc391]">
                        Explore flavours
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <form onSubmit={claimGift} className="space-y-5">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#ffb47a]">
                        Marketplace claim
                      </p>
                      <h2 className="mt-2 font-display text-3xl font-extrabold md:text-4xl">
                        Enter your unique claim code.
                      </h2>
                      {!isLoading && user && (
                        <p className="mt-3 text-sm text-[#d6c7b4]">
                          Hi {user.name?.split(' ')[0] || 'there'}, we prefilled what we could from your account.
                        </p>
                      )}
                    </div>

                    <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
                      <div className="space-y-2">
                        <Label htmlFor="claim-code" className="text-[#fff7ea]">Claim code</Label>
                        <Input
                          id="claim-code"
                          value={form.code}
                          onChange={(event) => setField('code', event.target.value)}
                          placeholder="AB-MP-2605-XXXXXX"
                          className="h-12 rounded-xl border-white/10 bg-white/10 text-white placeholder:text-white/35"
                        />
                      </div>
                      <Button
                        type="button"
                        onClick={validateCode}
                        disabled={codeStatus === 'checking'}
                        className="h-12 rounded-xl bg-white px-6 font-bold text-[#160d09] hover:bg-[#f7efe2]"
                      >
                        {codeStatus === 'checking' ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Check code'}
                      </Button>
                    </div>

                    {codeMessage && (
                      <p className={`rounded-xl px-4 py-3 text-sm font-semibold ${
                        codeStatus === 'valid'
                          ? 'bg-[#a8ddb1]/15 text-[#bff1c7]'
                          : 'bg-[#ff8a65]/15 text-[#ffb49c]'
                      }`}>
                        {codeMessage}
                      </p>
                    )}

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="gift-name" className="text-[#fff7ea]">Name on keyring</Label>
                        <Input
                          id="gift-name"
                          value={form.freeGiftName}
                          onChange={(event) => setField('freeGiftName', event.target.value)}
                          maxLength={10}
                          placeholder="Max 10 chars"
                          className="h-12 rounded-xl border-white/10 bg-white/10 text-white placeholder:text-white/35"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="customer-name" className="text-[#fff7ea]">Full name</Label>
                        <Input
                          id="customer-name"
                          value={form.customerName}
                          onChange={(event) => setField('customerName', event.target.value)}
                          className="h-12 rounded-xl border-white/10 bg-white/10 text-white placeholder:text-white/35"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="mobile" className="text-[#fff7ea]">Mobile</Label>
                        <Input
                          id="mobile"
                          value={form.customerMobile}
                          onChange={(event) => setField('customerMobile', event.target.value)}
                          className="h-12 rounded-xl border-white/10 bg-white/10 text-white placeholder:text-white/35"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-[#fff7ea]">Email optional</Label>
                        <Input
                          id="email"
                          type="email"
                          value={form.customerEmail}
                          onChange={(event) => setField('customerEmail', event.target.value)}
                          className="h-12 rounded-xl border-white/10 bg-white/10 text-white placeholder:text-white/35"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="address1" className="text-[#fff7ea]">Address line 1</Label>
                        <Input
                          id="address1"
                          value={form.addressLine1}
                          onChange={(event) => setField('addressLine1', event.target.value)}
                          className="h-12 rounded-xl border-white/10 bg-white/10 text-white placeholder:text-white/35"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="address2" className="text-[#fff7ea]">Address line 2 optional</Label>
                        <Input
                          id="address2"
                          value={form.addressLine2}
                          onChange={(event) => setField('addressLine2', event.target.value)}
                          className="h-12 rounded-xl border-white/10 bg-white/10 text-white placeholder:text-white/35"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city" className="text-[#fff7ea]">City</Label>
                        <Input
                          id="city"
                          value={form.city}
                          onChange={(event) => setField('city', event.target.value)}
                          className="h-12 rounded-xl border-white/10 bg-white/10 text-white placeholder:text-white/35"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state" className="text-[#fff7ea]">State</Label>
                        <Input
                          id="state"
                          value={form.state}
                          onChange={(event) => setField('state', event.target.value)}
                          className="h-12 rounded-xl border-white/10 bg-white/10 text-white placeholder:text-white/35"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pincode" className="text-[#fff7ea]">Pincode</Label>
                        <Input
                          id="pincode"
                          value={form.pincode}
                          onChange={(event) => setField('pincode', event.target.value)}
                          className="h-12 rounded-xl border-white/10 bg-white/10 text-white placeholder:text-white/35"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="order-ref" className="text-[#fff7ea]">Marketplace order ID optional</Label>
                        <Input
                          id="order-ref"
                          value={form.marketplaceOrderRef}
                          onChange={(event) => setField('marketplaceOrderRef', event.target.value)}
                          className="h-12 rounded-xl border-white/10 bg-white/10 text-white placeholder:text-white/35"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={submitting}
                      className="h-12 w-full rounded-xl bg-[#ffb47a] text-base font-black text-[#160d09] hover:bg-[#ffc391]"
                    >
                      {submitting ? (
                        <span className="inline-flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Claiming gift
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2">
                          <PackageCheck className="h-4 w-4" />
                          Claim free keyring
                        </span>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </div>

            <div className="mx-auto mt-8 flex max-w-4xl flex-wrap justify-center gap-3 text-sm font-bold">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-[#ffb47a]">
                <Sparkles className="h-4 w-4" />
                Single-use codes
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-[#a8ddb1]">
                <Gift className="h-4 w-4" />
                Named keyring worth Rs 200
              </span>
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
