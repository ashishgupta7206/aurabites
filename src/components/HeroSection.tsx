import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden gradient-hero pt-20">
      {/* Floating Makhana Doodles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-[10%] text-6xl animate-float opacity-40">🫛</div>
        <div className="absolute top-40 right-[15%] text-5xl animate-float-slow opacity-30" style={{ animationDelay: '1s' }}>✨</div>
        <div className="absolute bottom-32 left-[20%] text-4xl animate-float opacity-35" style={{ animationDelay: '0.5s' }}>🌾</div>
        <div className="absolute bottom-20 right-[25%] text-5xl animate-float-slow opacity-40" style={{ animationDelay: '1.5s' }}>🍃</div>
        <div className="absolute top-60 left-[5%] text-3xl animate-float opacity-25" style={{ animationDelay: '2s' }}>⭐</div>
      </div>

      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-20"
          poster="/placeholder.svg"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-woman-taking-a-bowl-of-nuts-42877-large.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/80 rounded-full text-sm font-medium text-secondary-foreground animate-fade-in">
            <Sparkles className="w-4 h-4 text-flavor-gold" />
            <span>India's Favorite Healthy Snack</span>
          </div>

          {/* Heading */}
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-extrabold text-foreground leading-tight animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Snack Smart with{' '}
            <span className="text-primary relative">
              Aurabites
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                <path d="M2 8C50 2 150 2 198 8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-flavor-gold opacity-60" />
              </svg>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Premium roasted makhana snacks packed with{' '}
            <span className="font-semibold text-foreground">10g protein</span>.
            Guilt-free, crunchy, and absolutely delicious.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Link to="/shop">
              <Button size="lg" className="rounded-full px-8 text-base font-semibold shadow-medium hover:shadow-lift transition-all">
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/categories">
              <Button variant="outline" size="lg" className="rounded-full px-8 text-base font-semibold bg-background/50 hover:bg-background">
                Explore Flavors
              </Button>
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="text-xl">🌱</span>
              <span>100% Natural</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="text-xl">💪</span>
              <span>High Protein</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="text-xl">🔥</span>
              <span>Low Calorie</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="text-xl">🚫</span>
              <span>No Preservatives</span>
            </div>
          </div>
        </div>
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 md:h-24">
          <path
            d="M0,60 C200,120 400,0 600,60 C800,120 1000,0 1200,60 L1200,120 L0,120 Z"
            className="fill-background"
          />
        </svg>
      </div>
    </section>
  );
};
