import { Helmet } from 'react-helmet-async';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { AuraMotionStage } from '@/components/AuraMotionStage';
import { SeedCollectionSection } from '@/components/SeedCollectionSection';
import { BenefitsSection } from '@/components/BenefitsSection';
import { BrandStory } from '@/components/BrandStory';
import { KeyringClaimSection } from '@/components/KeyringClaimSection';
import { CTASection } from '@/components/CTASection';
import { Footer } from '@/components/Footer';
import { CartBar } from '@/components/CartBar';
import { CartDrawer } from '@/components/CartDrawer';

const Index = () => {
  return (
    <>
      <Helmet>
        <title>AuraBites | Roasted Makhana & Premium Seed Jars</title>
        <meta
          name="description"
          content="Premium roasted AuraBites makhana and clean 500g seed jars. Explore bold makhana flavours, seed pantry staples and claim a free named gift with every order."
        />
      </Helmet>

      <div className="min-h-screen bg-[#0b0b0c]">
        <Navbar />
        <main>
          <AuraMotionStage />
          <HeroSection />
          <SeedCollectionSection />
          <BenefitsSection />
          <BrandStory />
          <KeyringClaimSection />
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
