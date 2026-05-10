import { Helmet } from 'react-helmet-async';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { AuraMotionStage } from '@/components/AuraMotionStage';
import { ProductShowcase } from '@/components/ProductShowcase';
import { BenefitsSection } from '@/components/BenefitsSection';
import { BrandStory } from '@/components/BrandStory';
import { KeyringClaimSection } from '@/components/KeyringClaimSection';
import { ProductGrid } from '@/components/ProductGrid';
import { CTASection } from '@/components/CTASection';
import { Footer } from '@/components/Footer';
import { CartBar } from '@/components/CartBar';
import { CartDrawer } from '@/components/CartDrawer';

const Index = () => {
  return (
    <>
      <Helmet>
        <title>AuraBites Makhana | Snack Light. Crunch Right.</title>
        <meta
          name="description"
          content="Premium roasted AuraBites makhana in bold Indian-inspired flavours. Explore the animated flavour showcase and claim a free named keyring worth Rs 200 with every order."
        />
      </Helmet>

      <div className="min-h-screen bg-[#0b0b0c]">
        <Navbar />
        <main>
          <AuraMotionStage />
          <HeroSection />
          <ProductShowcase />
          <BenefitsSection />
          <BrandStory />
          <KeyringClaimSection />
          <ProductGrid />
          <CTASection />
        </main>
        <Footer />
        <CartBar />
        <CartDrawer />
      </div>
    </>
  );
};

export default Index;
