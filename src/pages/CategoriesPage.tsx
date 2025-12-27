import { Helmet } from 'react-helmet-async';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CartBar } from '@/components/CartBar';
import { CartDrawer } from '@/components/CartDrawer';
import { CategoryCard } from '@/components/CategoryCard';
import { categories } from '@/data/products';

const CategoriesPage = () => {
  return (
    <>
      <Helmet>
        <title>Categories – Aurabites Makhana Snacks</title>
        <meta name="description" content="Browse Aurabites makhana categories. Roasted makhana, raw makhana, and premium dry fruits." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />
        
        <main className="pt-24 pb-32 md:pb-16">
          {/* Header */}
          <section className="gradient-cream py-12 md:py-20">
            <div className="container mx-auto px-4 text-center">
              <h1 className="font-display text-3xl md:text-5xl font-extrabold text-foreground">
                Browse Categories
              </h1>
              <p className="text-muted-foreground mt-4 max-w-md mx-auto">
                Find your perfect snack category
              </p>
            </div>
          </section>

          {/* Categories */}
          <section className="py-12">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category, index) => (
                  <div
                    key={category.id}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CategoryCard category={category} />
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

export default CategoriesPage;
