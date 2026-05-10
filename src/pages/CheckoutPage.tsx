import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ArrowLeft,
  MapPin,
  Phone,
  User,
  CreditCard,
  Truck,
  CheckCircle,
  Gift,
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";
import Cookies from "js-cookie";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { KEYRING_STORAGE_KEY, sanitizeKeyringName } from "@/lib/keyring";

const CheckoutPage = () => {
  const { items, clearCart } = useCart();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [keyringTouched, setKeyringTouched] = useState(false);

  // Preview state
  const [preview, setPreview] = useState<any>(null);
  const [isPreviewing, setIsPreviewing] = useState(false);

  const [formData, setFormData] = useState(() => ({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    keyringName: typeof window === "undefined" ? "" : localStorage.getItem(KEYRING_STORAGE_KEY) || "",
  }));

  const baseUrl = import.meta.env?.VITE_API_BASE_URL;

  const INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
  ];

  const [statesList, setStatesList] = useState<any[]>(INDIAN_STATES);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (keyringTouched) return;
    const firstName = sanitizeKeyringName(formData.name.split(/\s+/)[0] || "");
    if (!firstName) return;
    setFormData((prev) => (prev.keyringName === firstName ? prev : { ...prev, keyringName: firstName }));
  }, [formData.name, keyringTouched]);

  useEffect(() => {
    const cleanName = sanitizeKeyringName(formData.keyringName);
    if (cleanName) {
      localStorage.setItem(KEYRING_STORAGE_KEY, cleanName);
    }
  }, [formData.keyringName]);

  // ✅ Razorpay Open
  const openRazorpay = (payment: any, orderId: number) => {
    console.log("✅ openRazorpay called");
    console.log("payment object:", payment);
    console.log("orderId:", orderId);

    if (!window?.Razorpay) {
      toast({
        title: "Razorpay not loaded",
        description: "Please refresh and try again.",
      });
      console.error("❌ window.Razorpay is undefined. Script not loaded.");
      return;
    }

    if (!payment?.paymentReferenceId) {
      toast({
        title: "Payment error",
        description: "Missing Razorpay order_id from backend.",
      });
      console.error("❌ payment.paymentReferenceId missing:", payment);
      return;
    }

    const options: any = {
      key: payment.providerKey,
      amount: Number(payment.amount) * 100, // rupees -> paise
      currency: payment.currency,
      order_id: payment.paymentReferenceId, // MUST be Razorpay order id like order_xxx

      name: "Aurabites",
      description: "Order Payment",

      prefill: {
        name: formData.name,
        contact: formData.phone,
        email: formData.email,
      },

      theme: { color: "#7c3aed" },

      // ✅ Runs ONLY on success payment
      handler: async function (response: any) {
        console.log("✅ HANDLER CALLED (Payment Success)");
        console.log("Razorpay response:", response);

        try {
          toast({
            title: "Payment Success 🎉",
            description: "Verifying payment...",
          });

          const token = Cookies.get("token");

          const verifyPayload = {
            orderId: orderId,
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          };

          console.log("verifyPayload:", verifyPayload);

          const verifyUrl = `${baseUrl}/payments/verify`;
          console.log("verifyUrl:", verifyUrl);

          const verifyRes = await fetch(verifyUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify(verifyPayload),
          });

          const verifyData = await verifyRes.json();
          console.log("verifyRes status:", verifyRes.status);
          console.log("verifyData:", verifyData);

          if (!verifyRes.ok || !verifyData?.success) {
            throw new Error(verifyData?.message || "Payment verification failed");
          }

          toast({
            title: "Order Confirmed ✅",
            description: "Redirecting...",
          });

          clearCart();
          navigate(`/order-success?orderId=${orderId}`);
        } catch (err: any) {
          console.error("❌ Verification failed:", err);
          toast({
            title: "Verification failed ❌",
            description: err?.message || "Please contact support",
          });
          navigate(`/order-failed?orderId=${orderId}`);
        }
      },

      // ✅ Runs if user closes popup without payment
      modal: {
        ondismiss: function () {
          console.log("❌ Razorpay popup closed without payment");
          toast({
            title: "Payment cancelled",
            description: "You closed the payment window.",
          });
        },
      },
    };

    const rzp = new (window as any).Razorpay(options);

    // ✅ Runs if payment failed
    rzp.on("payment.failed", function (response: any) {
      console.log("❌ Razorpay payment.failed:", response);
      toast({
        title: "Payment Failed ❌",
        description: response?.error?.description || "Try again",
      });
      navigate(`/order-failed?orderId=${orderId}`);
    });

    rzp.open();
  };

  // ✅ Preview API
  const fetchPreview = async () => {
    if (!items || items.length === 0) return;
    setIsPreviewing(true);

    try {
      const body = {
        items: items.map((i) => ({
          productVariantId: i.id,
          quantity: i.quantity,
        })),
      };

      const token = Cookies.get("token");
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`${baseUrl}/orders/preview`, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok && data?.success) {
        setPreview(data.data);

        // Prefill address if backend returns
        if (data?.data?.address) {
          setFormData((prev) => ({
            ...prev,
            name: data.data.address.fullName ?? prev.name,
            phone: data.data.address.mobile ?? prev.phone,
            address: data.data.address.addressLine1 ?? prev.address,
            city: data.data.address.city ?? prev.city,
            state: data.data.address.state ?? prev.state,
            pincode: data.data.address.pincode ?? prev.pincode,
          }));
        }
      } else {
        toast({
          title: "Failed to generate order preview",
          description: data?.message ?? "Please try again.",
        });
      }
    } catch (err) {
      toast({
        title: "Network error",
        description: "Unable to fetch order preview.",
      });
      navigate("/shop");
    } finally {
      setIsPreviewing(false);
    }
  };

  useEffect(() => {
    fetchPreview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  // ✅ Submit Checkout
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.phone.length !== 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit mobile number.",
        variant: "destructive",
      });
      return;
    }

    if (formData.pincode.length !== 6) {
      toast({
        title: "Invalid Pincode",
        description: "Please enter a valid 6-digit pincode.",
        variant: "destructive",
      });
      return;
    }

    const token = Cookies.get("token");
    const fallbackKeyringName = sanitizeKeyringName(formData.name.split(/\s+/)[0] || "Aura");
    const freeKeyringName = sanitizeKeyringName(formData.keyringName) || fallbackKeyringName || "Aura";



    try {
      setIsSubmitting(true);

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      // 1) Create Order
      const post_order = await fetch(`${baseUrl}/orders/create`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          address: {
            fullName: formData.name,
            mobile: formData.phone,
            pincode: formData.pincode,
            city: formData.city,
            state: formData.state,
            addressLine1: formData.address,
          },
          paymentMethod: paymentMethod === 'online' ? 'ONLINE' : 'COD',
          emailId: formData.email,
          freeKeyringClaimed: true,
          freeKeyringName,
          freeKeyringSource: "WEBSITE_ORDER",
          items: items.map((i) => ({
            productVariantId: i.id,
            quantity: i.quantity,
          })),
        }),
      });

      const order_data = await post_order.json();
      if (paymentMethod === "cod") {
        toast({
          title: "Order placed (COD)",
          description: "You will pay on delivery",
        });
        clearCart();
        navigate(`/order-success?orderId=${order_data?.data?.id}`);
        return;
      }
      // console.log("order_data:", order_data);

      if (!post_order.ok || !order_data?.success) {
        throw new Error(order_data?.message || "Order creation failed");
      }

      const createdOrderId = order_data?.data?.id;
      const payableAmount = order_data?.data?.payableAmount;

      if (!createdOrderId) {
        throw new Error("Order ID missing from backend response");
      }

      // If COD, we are done
      if (paymentMethod === "cod") {
        toast({
          title: "Order Confirmed ✅",
          description: "You will pay on delivery",
        });
        clearCart();
        navigate(`/order-success?orderId=${createdOrderId}`);
        return;
      }

      // 2) Create Payment (for ONLINE)
      const res = await fetch(`${baseUrl}/payments/create`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          orderId: createdOrderId,
          amount: payableAmount,
          currency: "INR",
          provider: "RAZORPAY",
          method: "ONLINE",
        }),
      });

      const data = await res.json();
      console.log("payment create response:", data);

      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Payment init failed");
      }

      // 3) Open Razorpay
      openRazorpay(data.data, createdOrderId);
    } catch (err: any) {
      console.error("❌ Payment failed:", err);
      toast({
        title: "Payment failed",
        description: err?.message || "Please try again",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="font-display text-2xl font-bold mb-2">
            Your cart is empty
          </h1>
          <p className="text-muted-foreground mb-6">
            Add some delicious makhana to checkout!
          </p>
          <Link to="/">
            <Button className="rounded-full">Start Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  const displayTotal = preview?.payableAmount;
  const previewItems = preview?.items ?? [];

  return (
    <>
      <Helmet>
        <title>Checkout – Aurabites</title>
      </Helmet>

      <div className="min-h-screen bg-background pb-8">
        {/* Header */}
        <header className="bg-card border-b border-border sticky top-0 z-40">
          <div className="container mx-auto px-4 py-4 flex items-center gap-4">
            <Link to="/" className="p-2 -ml-2 hover:bg-secondary rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-xl">🌸</span>
              <span className="font-display font-bold text-lg text-primary">
                Checkout
              </span>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-6">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2 space-y-6">
              <form
                id="checkout-form"
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                {/* Delivery Details */}
                <div className="bg-card rounded-2xl border border-border p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="font-display font-bold text-lg">
                        Delivery Address
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Where should we deliver?
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="name"
                            name="name"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="pl-10 rounded-xl"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder="9876543210"
                            value={formData.phone}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, "");
                              if (val.length <= 10) {
                                setFormData((prev) => ({ ...prev, phone: val }));
                              }
                            }}
                            required
                            className="pl-10 rounded-xl"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email (optional)</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="rounded-xl"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address *</Label>
                      <Textarea
                        id="address"
                        name="address"
                        placeholder="House no, Street, Landmark"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        className="rounded-xl min-h-[80px]"
                      />
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          name="city"
                          placeholder="Mumbai"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                          className="rounded-xl"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="state">State *</Label>
                        <Select
                          value={formData.state}
                          onValueChange={(val) => setFormData(prev => ({ ...prev, state: val }))}
                          required
                        >
                          <SelectTrigger className="rounded-xl">
                            <SelectValue placeholder="Select State" />
                          </SelectTrigger>
                          <SelectContent>
                            {statesList.map((st: any, idx: number) => {
                              const value = typeof st === 'string' ? st : (st._id || st.id || st.name || st.state || String(idx));
                              const label = typeof st === 'string' ? st : (st.name || st.state || st.title || value);
                              return (
                                <SelectItem key={value} value={value}>
                                  {label}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="pincode">Pincode *</Label>
                        <Input
                          id="pincode"
                          name="pincode"
                          placeholder="400001"
                          value={formData.pincode}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, "");
                            if (val.length <= 6) {
                              setFormData((prev) => ({ ...prev, pincode: val }));
                            }
                          }}
                          required
                          className="rounded-xl"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Free Keyring */}
                <div className="bg-card rounded-2xl border border-border p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Gift className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="font-display font-bold text-lg">
                        Free Named Keyring
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Worth Rs 200, included with every website order.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-5 md:grid-cols-[1fr_180px] md:items-center">
                    <div className="space-y-2">
                      <Label htmlFor="keyringName">Name on keyring</Label>
                      <Input
                        id="keyringName"
                        name="keyringName"
                        placeholder="Max 10 characters"
                        value={formData.keyringName}
                        maxLength={10}
                        onChange={(e) => {
                          setKeyringTouched(true);
                          setFormData((prev) => ({ ...prev, keyringName: sanitizeKeyringName(e.target.value) }));
                        }}
                        className="rounded-xl"
                      />
                      <p className="text-xs text-muted-foreground">
                        If left blank, we will use your delivery first name.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-primary/15 bg-primary/5 p-4 text-center">
                      <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-orange-100 shadow-inner">
                        <span className="text-xs font-black uppercase text-primary">
                          {(sanitizeKeyringName(formData.keyringName) || sanitizeKeyringName(formData.name.split(/\s+/)[0] || "Aura")).slice(0, 4)}
                        </span>
                      </div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                        Free gift
                      </p>
                      <p className="mt-1 text-sm font-bold">
                        Rs 200 value
                      </p>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-card rounded-2xl border border-border p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="font-display font-bold text-lg">
                        Payment Method
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        How would you like to pay?
                      </p>
                    </div>
                  </div>

                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                    className="space-y-3"
                  >
                    <label
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === "online"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                        }`}
                    >
                      <RadioGroupItem value="online" id="online" />
                      <div className="flex-1">
                        <p className="font-semibold">Online Payment</p>
                        <p className="text-sm text-muted-foreground">
                          UPI, Cards, Net Banking
                        </p>
                      </div>
                      <span className="text-2xl">💳</span>
                    </label>

                    <label
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === "cod"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                        }`}
                    >
                      <RadioGroupItem value="cod" id="cod" />
                      <div className="flex-1">
                        <p className="font-semibold">Cash on Delivery (COD)</p>
                        <p className="text-sm text-muted-foreground">
                          Pay when the order is delivered
                        </p>
                      </div>
                      <span className="text-2xl">🚚</span>
                    </label>
                  </RadioGroup>
                </div>

                {/* Submit Button - Mobile */}
                <div className="lg:hidden">
                  <Button
                    type="submit"
                    disabled={isSubmitting || isPreviewing}
                    className="w-full rounded-full py-6 text-base font-semibold"
                  >
                    {isSubmitting || isPreviewing ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin">⏳</span>
                        Processing...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        Place Order • ₹{displayTotal}
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-2xl border border-border p-6 sticky top-24">
                <h2 className="font-display font-bold text-lg mb-4">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                  {previewItems.map((item: any, idx: number) => (
                    <div
                      key={item.variantId ?? item.id ?? idx}
                      className="flex gap-3"
                    >
                      <div className="w-14 h-14 bg-muted rounded-xl flex items-center justify-center flex-shrink-0">
                        <img
                          src={item.variantImage}
                          alt={item.productName ?? item.name}
                          className="w-10 h-10 object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link to={`/product/${item.productId}`}>
                          <p className="font-medium text-sm">
                            {item.productVariantName}
                          </p>
                        </Link>
                        <p className="text-xs text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold text-sm">
                        ₹{item.total ?? item.priceAtTime * item.quantity}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 p-3 bg-accent/10 rounded-xl mb-4">
                  <Truck className="w-5 h-5 text-accent" />
                  <span className="text-sm font-medium text-accent">
                    {preview
                      ? preview.deliveryCharge
                        ? `Delivery ₹${preview.deliveryCharge}`
                        : "Free Delivery"
                      : "Free Delivery"}
                  </span>
                </div>

                <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-xl mb-4">
                  <Gift className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium text-primary">
                    Free named keyring worth Rs 200
                  </span>
                </div>

                <div className="space-y-2 border-t border-border pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{preview?.totalAmount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery</span>
                    <span className="text-accent">
                      {preview
                        ? preview.deliveryCharge
                          ? `₹${preview.deliveryCharge}`
                          : "FREE"
                        : "FREE"}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                    <span>Total</span>
                    <span className="text-primary">₹{displayTotal}</span>
                  </div>
                </div>

                {/* ✅ Submit Button - Desktop (FIXED: NO onClick) */}
                <div className="hidden lg:block mt-6">
                  <Button
                    type="submit"
                    form="checkout-form"
                    disabled={isSubmitting || isPreviewing}
                    className="w-full rounded-full py-6 text-base font-semibold"
                  >
                    {isSubmitting || isPreviewing ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin">⏳</span>
                        Processing...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        Place Order • ₹{displayTotal}
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
