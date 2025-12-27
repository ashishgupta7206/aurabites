import { Helmet } from 'react-helmet-async';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { FeaturedProducts } from '@/components/FeaturedProducts';
import { CategoriesSection } from '@/components/CategoriesSection';
import { AllProducts } from '@/components/AllProducts';
import { ReviewsSection } from '@/components/ReviewsSection';
import { Footer } from '@/components/Footer';
import { CartBar } from '@/components/CartBar';
import { CartDrawer } from '@/components/CartDrawer';

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Aurabites – Premium Makhana Snacks | Healthy & Delicious</title>
        <meta name="description" content="Discover Aurabites premium roasted makhana snacks. 10g protein, natural ingredients, zero preservatives. India's favorite healthy snack brand." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <HeroSection />
          <FeaturedProducts />
          <CategoriesSection />
          <AllProducts />
          <ReviewsSection />
        </main>
        <Footer />
        <CartBar />
        <CartDrawer />
      </div>
    </>
  );
};

export default Index;
