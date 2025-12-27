import { products } from '@/data/products';
import { ProductCard } from './ProductCard';

export const FeaturedProducts = () => {
  const featured = products.filter(p => p.isBestseller || p.isNew).slice(0, 6);

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-sm font-medium text-primary uppercase tracking-wider">
            Fan Favorites
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-foreground mt-2">
            Our Bestsellers
          </h2>
          <p className="text-muted-foreground mt-3 max-w-md mx-auto">
            Discover the flavors everyone's talking about
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((product, index) => (
            <div
              key={product.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
