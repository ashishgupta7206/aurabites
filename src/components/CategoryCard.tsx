import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Wheat } from 'lucide-react';
import { Category } from '@/data/products';

interface CategoryCardProps {
  category: Category;
}

export const CategoryCard = ({ category }: CategoryCardProps) => {
  const content = (
    <div className={`relative ${category.gradient} rounded-3xl p-6 md:p-8 min-w-[280px] md:min-w-[320px] min-h-[240px] overflow-hidden product-card-hover border border-border/50`}>
      {category.imageUrl && (
        <>
          <img
            src={category.imageUrl}
            alt=""
            loading="lazy"
            aria-hidden="true"
            className="absolute inset-y-0 right-0 h-full w-3/5 object-cover opacity-20 mix-blend-multiply"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/60 to-white/10" />
        </>
      )}

      {/* Coming Soon Badge */}
      {category.comingSoon && (
        <div className="absolute right-4 top-4 z-10">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-muted text-muted-foreground text-xs font-medium rounded-full">
            <Clock className="w-3 h-3" />
            Coming Soon
          </span>
        </div>
      )}

      {/* Visual */}
      <div className="relative z-10 mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/70 shadow-sm">
        <Wheat className="h-8 w-8 text-primary" aria-hidden="true" />
      </div>

      {/* Content */}
      <h3 className="relative z-10 font-display font-bold text-xl md:text-2xl text-foreground mb-2 max-w-[13rem]">
        {category.name}
      </h3>
      <p className="relative z-10 text-sm text-muted-foreground mb-4 max-w-[13rem]">
        {category.description}
      </p>

      {/* CTA */}
      {!category.comingSoon && (
        <div className="relative z-10 inline-flex items-center gap-2 text-primary font-semibold text-sm group-hover:gap-3 transition-all">
          Explore
          <ArrowRight className="w-4 h-4" />
        </div>
      )}

      {/* Decorative */}
      <div className="absolute -bottom-5 -right-5 text-primary/10">
        <Wheat className="h-28 w-28" aria-hidden="true" />
      </div>
    </div>
  );

  if (category.comingSoon) {
    return <div className="opacity-70 cursor-not-allowed">{content}</div>;
  }

  return (
    <Link to={`/category/${category.id}`} className="group">
      {content}
    </Link>
  );
};
