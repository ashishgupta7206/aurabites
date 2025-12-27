import { Helmet } from 'react-helmet-async';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CartBar } from '@/components/CartBar';
import { CartDrawer } from '@/components/CartDrawer';
import { ProductCard } from '@/components/ProductCard';
import { products } from '@/data/products';

const ShopPage = () => {
  return (
    <>
      <Helmet>
        <title>Shop All Makhana Snacks – Aurabites</title>
        <meta name="description" content="Shop premium roasted makhana snacks from Aurabites. Multiple flavors, 10g protein per pack. Free delivery across India." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />
        
        <main className="pt-24 pb-32 md:pb-16">
          {/* Header */}
          <section className="gradient-cream py-12 md:py-20">
            <div className="container mx-auto px-4 text-center">
              <h1 className="font-display text-3xl md:text-5xl font-extrabold text-foreground">
                Shop All Flavors
              </h1>
              <p className="text-muted-foreground mt-4 max-w-md mx-auto">
                Premium roasted makhana in irresistible flavors. 10g protein, zero guilt.
              </p>
            </div>
          </section>

          {/* Products Grid */}
          <section className="py-12">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product, index) => (
                  <div
                    key={product.id}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
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

export default ShopPage;
