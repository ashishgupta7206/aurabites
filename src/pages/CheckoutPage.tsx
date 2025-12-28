import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, MapPin, Phone, User, CreditCard, Truck, CheckCircle } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/hooks/use-toast';

const CheckoutPage = () => {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    pincode: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    toast({
      title: "Order Placed Successfully! 🎉",
      description: "You'll receive a confirmation shortly.",
    });

    clearCart();
    navigate('/');
    setIsSubmitting(false);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="font-display text-2xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">Add some delicious makhana to checkout!</p>
          <Link to="/">
            <Button className="rounded-full">Start Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

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
              <span className="font-display font-bold text-lg text-primary">Checkout</span>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-6">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2 space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Delivery Details */}
                <div className="bg-card rounded-2xl border border-border p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="font-display font-bold text-lg">Delivery Address</h2>
                      <p className="text-sm text-muted-foreground">Where should we deliver?</p>
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
                            onChange={handleInputChange}
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

                    <div className="grid sm:grid-cols-2 gap-4">
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
                        <Label htmlFor="pincode">Pincode *</Label>
                        <Input
                          id="pincode"
                          name="pincode"
                          placeholder="400001"
                          value={formData.pincode}
                          onChange={handleInputChange}
                          required
                          className="rounded-xl"
                        />
                      </div>
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
                      <h2 className="font-display font-bold text-lg">Payment Method</h2>
                      <p className="text-sm text-muted-foreground">How would you like to pay?</p>
                    </div>
                  </div>

                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                    <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
                      <RadioGroupItem value="cod" id="cod" />
                      <div className="flex-1">
                        <p className="font-semibold">Cash on Delivery</p>
                        <p className="text-sm text-muted-foreground">Pay when you receive</p>
                      </div>
                      <span className="text-2xl">💵</span>
                    </label>

                    <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'online' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
                      <RadioGroupItem value="online" id="online" />
                      <div className="flex-1">
                        <p className="font-semibold">Online Payment</p>
                        <p className="text-sm text-muted-foreground">UPI, Cards, Net Banking</p>
                      </div>
                      <span className="text-2xl">💳</span>
                    </label>
                  </RadioGroup>
                </div>

                {/* Submit Button - Mobile */}
                <div className="lg:hidden">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-full py-6 text-base font-semibold"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin">⏳</span>
                        Processing...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        Place Order • ₹{totalPrice}
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            </div>

            {/* Order Summary - Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-2xl border border-border p-6 sticky top-24">
                <h2 className="font-display font-bold text-lg mb-4">Order Summary</h2>

                {/* Items */}
                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                  {items.map(item => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-14 h-14 bg-muted rounded-xl flex items-center justify-center flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-10 h-10 object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link to={`/product/${item.id}`}> <p className="font-medium text-sm ">{item.name}</p></Link>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-sm">₹{item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>

                {/* Delivery Badge */}
                <div className="flex items-center gap-2 p-3 bg-accent/10 rounded-xl mb-4">
                  <Truck className="w-5 h-5 text-accent" />
                  <span className="text-sm font-medium text-accent">Free Delivery</span>
                </div>

                {/* Totals */}
                <div className="space-y-2 border-t border-border pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery</span>
                    <span className="text-accent">FREE</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                    <span>Total</span>
                    <span className="text-primary">₹{totalPrice}</span>
                  </div>
                </div>

                {/* Submit Button - Desktop */}
                <div className="hidden lg:block mt-6">
                  <Button
                    type="submit"
                    form="checkout-form"
                    disabled={isSubmitting}
                    className="w-full rounded-full py-6 text-base font-semibold"
                    onClick={handleSubmit}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin">⏳</span>
                        Processing...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        Place Order
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
