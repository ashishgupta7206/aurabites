import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Mail, Phone, MapPin, Send, Instagram, Loader2 } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CartBar } from '@/components/CartBar';
import { CartDrawer } from '@/components/CartDrawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { CONTACT_INFO } from '@/lib/constants';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNo: '',
    message: '',
    orderId: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email && !formData.mobileNo) {
      toast({
        title: "Validation Error",
        description: "Please provide either an email or a mobile number.",
        variant: "destructive",
      });
      return;
    }

    if (formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast({
          title: "Invalid Email",
          description: "Please enter a valid email address.",
          variant: "destructive",
        });
        return;
      }
    }

    if (formData.mobileNo) {
      // Allow 10 digits
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(formData.mobileNo.replace(/\D/g, ''))) {
        toast({
          title: "Invalid Mobile Number",
          description: "Please enter a valid 10-digit mobile number.",
          variant: "destructive",
        });
        return;
      }
    }

    if (formData.orderId) {
      // Basic check, adjust if your Order ID format is specific
      if (formData.orderId.trim().length === 0) {
        toast({
          title: "Invalid Order ID",
          description: "Please enter a valid Order ID.",
          variant: "destructive",
        });
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/contact-us', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Message sent! 📬",
          description: "We'll get back to you within 24 hours.",
        });
        setFormData({ name: '', email: '', mobileNo: '', message: '', orderId: '' });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us – Aurabites</title>
        <meta name="description" content="Get in touch with Aurabites. We'd love to hear from you!" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="pt-24 pb-32 md:pb-16">
          {/* Header */}
          <section className="gradient-cream py-12 md:py-20">
            <div className="container mx-auto px-4 text-center">
              <h1 className="font-display text-3xl md:text-5xl font-extrabold text-foreground">
                Get in Touch
              </h1>
              <p className="text-muted-foreground mt-4 max-w-md mx-auto">
                Have questions? We'd love to hear from you.
              </p>
            </div>
          </section>

          {/* Content */}
          <section className="py-12">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                {/* Contact Info */}
                <div className="space-y-8">
                  <div>
                    <h2 className="font-display text-2xl font-bold mb-6">Contact Info</h2>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Mail className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">Email</p>
                          <a href={`mailto:${CONTACT_INFO.EMAIL}`} className="text-muted-foreground hover:text-primary">
                            {CONTACT_INFO.EMAIL}
                          </a>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Phone className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">Phone</p>
                          <a href={`tel:${CONTACT_INFO.PHONE.replace(/\s+/g, '')}`} className="text-muted-foreground hover:text-primary">
                            {CONTACT_INFO.PHONE}
                          </a>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">Address</p>
                          <p className="text-muted-foreground">
                            {CONTACT_INFO.ADDRESS}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Instagram className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">Instagram</p>
                          <a href={CONTACT_INFO.INSTAGRAM} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                            @aurabites
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Form */}
                <div className="bg-card rounded-3xl border border-border p-6 md:p-8">
                  <h2 className="font-display text-2xl font-bold mb-6">Send a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mobileNo">Mobile Number (Optional if Email is provided)</Label>
                      <Input
                        id="mobileNo"
                        type="number"
                        placeholder="9876543210"
                        value={formData.mobileNo}
                        onChange={(e) => setFormData({ ...formData, mobileNo: e.target.value })}
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email (Optional if Mobile is provided)</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="orderId">Order ID (Optional)</Label>
                      <Input
                        id="orderId"
                        placeholder="ORD-12345"
                        value={formData.orderId}
                        onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Your message..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                        className="rounded-xl min-h-[120px]"
                      />
                    </div>
                    <Button type="submit" className="w-full rounded-xl" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4 mr-2" />
                      )}
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </div>
              </div>
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

export default ContactPage;
