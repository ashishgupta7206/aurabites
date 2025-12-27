import { categories } from '@/data/products';
import { CategoryCard } from './CategoryCard';

export const CategoriesSection = () => {
  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-10">
          <span className="text-sm font-medium text-primary uppercase tracking-wider">
            Browse by Category
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-foreground mt-2">
            Find Your Crunch
          </h2>
        </div>

        {/* Horizontal Scroll on Mobile */}
        <div className="flex gap-6 overflow-x-auto pb-4 scroll-snap-x scrollbar-hide md:justify-center md:flex-wrap">
          {categories.map((category, index) => (
            <div
              key={category.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CategoryCard category={category} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
