import { products } from '@/data/products';
import { ProductCard } from './ProductCard';

export const AllProducts = () => {
  return (
    <section className="py-16 md:py-24 bg-background relative overflow-hidden">
      {/* Background Doodles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-[5%] text-6xl opacity-10 animate-float">🫛</div>
        <div className="absolute top-40 right-[8%] text-5xl opacity-10 animate-float-slow" style={{ animationDelay: '1s' }}>✨</div>
        <div className="absolute bottom-40 left-[12%] text-4xl opacity-10 animate-float" style={{ animationDelay: '0.5s' }}>🌾</div>
        <div className="absolute bottom-20 right-[15%] text-5xl opacity-10 animate-float-slow" style={{ animationDelay: '1.5s' }}>🍃</div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-sm font-medium text-primary uppercase tracking-wider">
            Complete Collection
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-foreground mt-2">
            All Flavors
          </h2>
          <p className="text-muted-foreground mt-3 max-w-md mx-auto">
            Explore our entire range of premium makhana snacks
          </p>
        </div>

        {/* Products Grid */}
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
  );
};
