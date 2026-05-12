import { Helmet } from 'react-helmet-async';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { AuraMotionStage } from '@/components/AuraMotionStage';
import { HeroFlavorCarousel } from '@/components/HeroFlavorCarousel';
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
          <HeroFlavorCarousel />
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
