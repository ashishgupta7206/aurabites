import productCreamOnion from '@/assets/product-cream-onion.png';
import productPeriPeri from '@/assets/product-peri-peri.png';
import productPinkSalt from '@/assets/product-pink-salt.png';
import productCheese from '@/assets/product-cheese.png';
import productTandoori from '@/assets/product-tandoori.png';
import productMint from '@/assets/product-mint.png';
import productSalted from '@/assets/product-salted.png';
import productBbq from '@/assets/product-bbq.png';

export interface Product {
  id: string;
  name: string;
  flavor: string;
  description: string;
  price: number;
  originalPrice?: number;
  protein: string;
  category: 'roasted' | 'raw' | 'dryfruits';
  flavorColor: 'cream-onion' | 'himalayan' | 'peri-peri' | 'mint' | 'tandoori' | 'gold';
  image: string;
  badge?: string;
  isNew?: boolean;
  isBestseller?: boolean;
}

export const products: Product[] = [
  {
    id: 'p1',
    name: 'Aurabites Cream & Onion',
    flavor: 'Cream & Onion',
    description: 'Creamy, tangy, and irresistibly crunchy',
    price: 149,
    originalPrice: 179,
    protein: '10g',
    category: 'roasted',
    flavorColor: 'cream-onion',
    image: productCreamOnion,
    isBestseller: true,
  },
  {
    id: 'p2',
    name: 'Aurabites Peri Peri',
    flavor: 'Peri Peri',
    description: 'Spicy, smoky, and full of zing',
    price: 149,
    originalPrice: 179,
    protein: '10g',
    category: 'roasted',
    flavorColor: 'peri-peri',
    image: productPeriPeri,
    isBestseller: true,
  },
  {
    id: 'p3',
    name: 'Aurabites Himalayan Pink Salt',
    flavor: 'Himalayan Pink Salt',
    description: 'Pure, simple, and perfectly salted',
    price: 139,
    protein: '10g',
    category: 'roasted',
    flavorColor: 'himalayan',
    image: productPinkSalt,
  },
  {
    id: 'p4',
    name: 'Aurabites Cheese Blast',
    flavor: 'Cheese Blast',
    description: 'Rich, cheesy, and utterly addictive',
    price: 159,
    originalPrice: 189,
    protein: '10g',
    category: 'roasted',
    flavorColor: 'gold',
    image: productCheese,
    isNew: true,
  },
  {
    id: 'p5',
    name: 'Aurabites Tandoori Masala',
    flavor: 'Tandoori Masala',
    description: 'Smoky, spicy, and authentically Indian',
    price: 149,
    protein: '10g',
    category: 'roasted',
    flavorColor: 'tandoori',
    image: productTandoori,
    isBestseller: true,
  },
  {
    id: 'p6',
    name: 'Aurabites Mint Pudina',
    flavor: 'Mint Pudina',
    description: 'Refreshing, cool, and delightfully crunchy',
    price: 149,
    protein: '10g',
    category: 'roasted',
    flavorColor: 'mint',
    image: productMint,
  },
  {
    id: 'p7',
    name: 'Aurabites Classic Salted',
    flavor: 'Classic Salted',
    description: 'The OG snack, lightly salted perfection',
    price: 129,
    protein: '10g',
    category: 'roasted',
    flavorColor: 'himalayan',
    image: productSalted,
  },
  {
    id: 'p8',
    name: 'Aurabites BBQ Blaze',
    flavor: 'BBQ Blaze',
    description: 'Sweet, smoky, and utterly satisfying',
    price: 159,
    originalPrice: 189,
    protein: '10g',
    category: 'roasted',
    flavorColor: 'tandoori',
    image: productBbq,
    isNew: true,
  },
];

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  gradient: string;
  comingSoon?: boolean;
}

export const categories: Category[] = [
  {
    id: 'c1',
    name: 'Roasted Makhana',
    slug: 'roasted',
    description: 'Crunchy, flavorful, guilt-free snacking',
    icon: '🌾',
    gradient: 'gradient-mint',
  },
  {
    id: 'c2',
    name: 'Raw Makhana',
    slug: 'raw',
    description: 'Pure, unprocessed fox nuts',
    icon: '🌿',
    gradient: 'gradient-teal',
    comingSoon: true,
  },
  {
    id: 'c3',
    name: 'Premium Dry Fruits',
    slug: 'dryfruits',
    description: 'Cashews, almonds & dehydrated treats',
    icon: '🥜',
    gradient: 'gradient-rust',
    comingSoon: true,
  },
];

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
