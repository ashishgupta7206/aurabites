
export interface Product {
  id: string;
  productId: number;
  name: string;
  flavor: string;
  description: string;
  price: number;
  originalPrice?: number;
  protein: string;
  categoryId: string;
  flavorColor: string;
  image: string;
  badge?: string;
  isNew?: boolean;
  isBestseller?: boolean;
}


export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  gradient: string;
  comingSoon?: boolean;
}


export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  avatar?: string;
  date: string;
}

export const reviews: Review[] = [
  {
    id: 'r1',
    name: 'Priya S.',
    rating: 5,
    comment: 'Best makhana I have ever tasted! The Peri Peri flavor is absolutely addictive. My kids love it too!',
    date: '2 days ago',
  },
  {
    id: 'r2',
    name: 'Rahul M.',
    rating: 5,
    comment: 'Finally a healthy snack that actually tastes amazing. The crunch is perfect and 10g protein is a bonus!',
    date: '1 week ago',
  },
  {
    id: 'r3',
    name: 'Ananya K.',
    rating: 4,
    comment: 'Love the Cream & Onion flavor! Perfect for my evening cravings. Packaging is also really nice.',
    date: '2 weeks ago',
  },
  {
    id: 'r4',
    name: 'Vikram P.',
    rating: 5,
    comment: 'Ordered the combo pack and every flavor was a hit at our house party. Will definitely reorder!',
    date: '3 weeks ago',
  },
  {
    id: 'r5',
    name: 'Sneha R.',
    rating: 5,
    comment: 'As a fitness enthusiast, I am always looking for healthy snacks. Aurabites is now my go-to!',
    date: '1 month ago',
  },
];
