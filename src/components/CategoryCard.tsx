import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import { Category } from '@/data/products';

interface CategoryCardProps {
  category: Category;
}

export const CategoryCard = ({ category }: CategoryCardProps) => {
  const content = (
    <div className={`relative ${category.gradient} rounded-3xl p-6 md:p-8 min-w-[280px] md:min-w-[320px] h-[220px] overflow-hidden product-card-hover border border-border/50`}>
      {/* Coming Soon Badge */}
      {category.comingSoon && (
        <div className="absolute top-4 right-4">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-muted text-muted-foreground text-xs font-medium rounded-full">
            <Clock className="w-3 h-3" />
            Coming Soon
          </span>
        </div>
      )}

      {/* Icon */}
      <div className="text-5xl md:text-6xl mb-4">{category.icon}</div>

      {/* Content */}
      <h3 className="font-display font-bold text-xl md:text-2xl text-foreground mb-2">
        {category.name}
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        {category.description}
      </p>

      {/* CTA */}
      {!category.comingSoon && (
        <div className="inline-flex items-center gap-2 text-primary font-semibold text-sm group-hover:gap-3 transition-all">
          Explore
          <ArrowRight className="w-4 h-4" />
        </div>
      )}

      {/* Decorative */}
      <div className="absolute -bottom-4 -right-4 text-8xl opacity-10">
        {category.icon}
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
