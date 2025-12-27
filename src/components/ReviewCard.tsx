import { Star } from 'lucide-react';
import { Review } from '@/data/products';

interface ReviewCardProps {
  review: Review;
}

export const ReviewCard = ({ review }: ReviewCardProps) => {
  return (
    <div className="bg-card rounded-2xl p-6 shadow-soft min-w-[300px] md:min-w-[350px] border border-border/50">
      {/* Stars */}
      <div className="flex gap-1 mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < review.rating
                ? 'fill-flavor-gold text-flavor-gold'
                : 'fill-muted text-muted'
            }`}
          />
        ))}
      </div>

      {/* Comment */}
      <p className="text-foreground mb-4 leading-relaxed">
        "{review.comment}"
      </p>

      {/* Author */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
          {review.name.charAt(0)}
        </div>
        <div>
          <p className="font-semibold text-sm text-foreground">{review.name}</p>
          <p className="text-xs text-muted-foreground">{review.date}</p>
        </div>
      </div>
    </div>
  );
};
