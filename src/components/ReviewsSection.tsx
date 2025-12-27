import { reviews } from '@/data/products';
import { ReviewCard } from './ReviewCard';

export const ReviewsSection = () => {
  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-10">
          <span className="text-sm font-medium text-primary uppercase tracking-wider">
            Testimonials
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-foreground mt-2">
            Loved by Snack Lovers 💛
          </h2>
          <p className="text-muted-foreground mt-3 max-w-md mx-auto">
            Don't just take our word for it
          </p>
        </div>

        {/* Reviews Scroll */}
        <div className="flex gap-6 overflow-x-auto pb-4 scroll-snap-x scrollbar-hide">
          {reviews.map((review, index) => (
            <div
              key={review.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ReviewCard review={review} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
