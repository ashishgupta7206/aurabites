import { Helmet } from 'react-helmet-async';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CartBar } from '@/components/CartBar';
import { CartDrawer } from '@/components/CartDrawer';

const AboutPage = () => {
  return (
    <>
      <Helmet>
        <title>About Us – Aurabites Makhana Snacks</title>
        <meta name="description" content="Learn about Aurabites, India's favorite healthy snack brand. Our mission is to make guilt-free snacking delicious and accessible to everyone." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />
        
        <main className="pt-24 pb-32 md:pb-16">
          {/* Hero */}
          <section className="gradient-cream py-16 md:py-24">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <span className="text-5xl mb-6 block">🌸</span>
                <h1 className="font-display text-3xl md:text-5xl font-extrabold text-foreground">
                  Our Story
                </h1>
                <p className="text-lg text-muted-foreground mt-6 leading-relaxed">
                  Aurabites was born from a simple idea: healthy snacking shouldn't mean compromising on taste. We believe that every crunch should bring joy and wellness to your life.
                </p>
              </div>
            </div>
          </section>

          {/* Values */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-12">
                What We Stand For
              </h2>
              <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div className="text-center p-6 bg-card rounded-3xl border border-border">
                  <span className="text-4xl block mb-4">🌱</span>
                  <h3 className="font-display font-bold text-lg mb-2">100% Natural</h3>
                  <p className="text-muted-foreground text-sm">
                    No artificial flavors, colors, or preservatives. Just pure, wholesome ingredients.
                  </p>
                </div>
                <div className="text-center p-6 bg-card rounded-3xl border border-border">
                  <span className="text-4xl block mb-4">💪</span>
                  <h3 className="font-display font-bold text-lg mb-2">High Protein</h3>
                  <p className="text-muted-foreground text-sm">
                    10g of protein per pack to fuel your day and keep you satisfied.
                  </p>
                </div>
                <div className="text-center p-6 bg-card rounded-3xl border border-border">
                  <span className="text-4xl block mb-4">❤️</span>
                  <h3 className="font-display font-bold text-lg mb-2">Made with Love</h3>
                  <p className="text-muted-foreground text-sm">
                    Every batch is crafted with care and passion in India.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Mission */}
          <section className="py-16 bg-secondary/30">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="font-display text-2xl md:text-3xl font-bold mb-6">
                  Our Mission
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  To revolutionize the Indian snacking landscape by offering delicious, nutritious, and guilt-free alternatives that don't compromise on taste. We're on a mission to make healthy snacking the norm, not the exception.
                </p>
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

export default AboutPage;
