import basilJar from '@/assets/seeds/basil-jar.webp';
import basilLabel from '@/assets/seeds/basil-label.webp';
import chiaJar from '@/assets/seeds/chia-jar.webp';
import chiaLabel from '@/assets/seeds/chia-label.webp';
import flaxJar from '@/assets/seeds/flax-jar.webp';
import flaxLabel from '@/assets/seeds/flax-label.webp';
import muskMelonJar from '@/assets/seeds/musk-melon-jar.webp';
import muskMelonLabel from '@/assets/seeds/musk-melon-label.webp';
import pumpkinJar from '@/assets/seeds/pumpkin-jar.webp';
import pumpkinLabel from '@/assets/seeds/pumpkin-label.webp';
import sesameJar from '@/assets/seeds/sesame-jar.webp';
import sesameLabel from '@/assets/seeds/sesame-label.webp';
import sunflowerJar from '@/assets/seeds/sunflower-jar.webp';
import sunflowerLabel from '@/assets/seeds/sunflower-label.webp';
import watermelonJar from '@/assets/seeds/watermelon-jar.webp';
import watermelonLabel from '@/assets/seeds/watermelon-label.webp';

export interface SeedProduct {
  id: string;
  name: string;
  shortName: string;
  accent: string;
  accentSoft: string;
  accentDeep: string;
  description: string;
  detail: string;
  protein: string;
  netWeight: string;
  sku: string;
  jarImage: string;
  labelImage: string;
  alt: string;
  labelAlt: string;
  shopPath: string;
}

export const seedProducts: SeedProduct[] = [
  {
    id: 'musk-melon',
    name: 'Musk Melon Seeds',
    shortName: 'Musk Melon',
    accent: '#B88618',
    accentSoft: '#F4C873',
    accentDeep: '#5E3A09',
    description: 'Mild, creamy seeds with naturally wholesome snack energy.',
    detail: 'A clean 500g pantry jar for smoothies, trail mixes, breakfast bowls and everyday topping rituals.',
    protein: '29.0 g',
    netWeight: '500 g',
    sku: 'AB-SEED-JAR-MUSK-MELON',
    jarImage: muskMelonJar,
    labelImage: muskMelonLabel,
    alt: 'AuraBites Musk Melon Seeds jar',
    labelAlt: 'AuraBites Musk Melon Seeds front and back label',
    shopPath: '/shop',
  },
  {
    id: 'flax',
    name: 'Flax Seeds',
    shortName: 'Flax',
    accent: '#7A3F1F',
    accentSoft: '#D2A07D',
    accentDeep: '#3F1F10',
    description: 'Toasty brown seeds rich in fibre and plant goodness.',
    detail: 'A grounded pantry staple for rotis, granola, baking, chutneys and daily seed blends.',
    protein: '18.3 g',
    netWeight: '500 g',
    sku: 'AB-SEED-JAR-FLAX',
    jarImage: flaxJar,
    labelImage: flaxLabel,
    alt: 'AuraBites Flax Seeds jar',
    labelAlt: 'AuraBites Flax Seeds front and back label',
    shopPath: '/shop',
  },
  {
    id: 'chia',
    name: 'Chia Seeds',
    shortName: 'Chia',
    accent: '#153D4B',
    accentSoft: '#84A9B7',
    accentDeep: '#081E28',
    description: 'Tiny omega-rich seeds that bloom beautifully in breakfast bowls.',
    detail: 'Built for chia pudding, overnight oats, detox drinks and clean daily nutrition.',
    protein: '16.5 g',
    netWeight: '500 g',
    sku: 'AB-SEED-JAR-CHIA',
    jarImage: chiaJar,
    labelImage: chiaLabel,
    alt: 'AuraBites Chia Seeds jar',
    labelAlt: 'AuraBites Chia Seeds front and back label',
    shopPath: '/shop',
  },
  {
    id: 'sesame',
    name: 'Sesame Seeds',
    shortName: 'Sesame',
    accent: '#D97718',
    accentSoft: '#FFC46C',
    accentDeep: '#72380D',
    description: 'Nutty, mineral-rich sesame for laddoos, toppings and pantry crunch.',
    detail: 'A warm everyday seed for Indian sweets, salads, stir-fries, chutneys and bakery recipes.',
    protein: '17.7 g',
    netWeight: '500 g',
    sku: 'AB-SEED-JAR-SESAME',
    jarImage: sesameJar,
    labelImage: sesameLabel,
    alt: 'AuraBites Sesame Seeds jar',
    labelAlt: 'AuraBites Sesame Seeds front and back label',
    shopPath: '/shop',
  },
  {
    id: 'sunflower',
    name: 'Sunflower Seeds',
    shortName: 'Sunflower',
    accent: '#E8B700',
    accentSoft: '#FFE483',
    accentDeep: '#6E5300',
    description: 'Bright, crunchy seeds with clean everyday snacking energy.',
    detail: 'A bold yellow jar for salads, snack mixes, breakfast bowls and desk-side crunch.',
    protein: '20.8 g',
    netWeight: '500 g',
    sku: 'AB-SEED-JAR-SUNFLOWER',
    jarImage: sunflowerJar,
    labelImage: sunflowerLabel,
    alt: 'AuraBites Sunflower Seeds jar',
    labelAlt: 'AuraBites Sunflower Seeds front and back label',
    shopPath: '/shop',
  },
  {
    id: 'pumpkin',
    name: 'Pumpkin Seeds',
    shortName: 'Pumpkin',
    accent: '#66763A',
    accentSoft: '#B6C67B',
    accentDeep: '#2F3B17',
    description: 'Green, protein-forward seeds with clean earthy crunch.',
    detail: 'A high-protein seed jar made for snack bowls, gym bags, salads and quick topping upgrades.',
    protein: '30.2 g',
    netWeight: '500 g',
    sku: 'AB-SEED-JAR-PUMPKIN',
    jarImage: pumpkinJar,
    labelImage: pumpkinLabel,
    alt: 'AuraBites Pumpkin Seeds jar',
    labelAlt: 'AuraBites Pumpkin Seeds front and back label',
    shopPath: '/shop',
  },
  {
    id: 'basil',
    name: 'Basil Seeds (Sabja)',
    shortName: 'Basil',
    accent: '#0F6B3A',
    accentSoft: '#89C99D',
    accentDeep: '#05391F',
    description: 'Cooling sabja seeds for drinks, bowls and everyday gut-friendly rituals.',
    detail: 'A fresh green jar for soaked sabja drinks, falooda, smoothies and light summer routines.',
    protein: '15.6 g',
    netWeight: '500 g',
    sku: 'AB-SEED-JAR-BASIL',
    jarImage: basilJar,
    labelImage: basilLabel,
    alt: 'AuraBites Basil Seeds Sabja jar',
    labelAlt: 'AuraBites Basil Seeds Sabja front and back label',
    shopPath: '/shop',
  },
  {
    id: 'watermelon',
    name: 'Watermelon Seeds',
    shortName: 'Watermelon',
    accent: '#D9435E',
    accentSoft: '#F5A1AF',
    accentDeep: '#7C1C2E',
    description: 'Light, clean seeds with a subtle nutty bite.',
    detail: 'A bright red seed jar for roasted blends, smoothie bowls, munch mixes and simple pantry protein.',
    protein: '30.4 g',
    netWeight: '500 g',
    sku: 'AB-SEED-JAR-WATERMELON',
    jarImage: watermelonJar,
    labelImage: watermelonLabel,
    alt: 'AuraBites Watermelon Seeds jar',
    labelAlt: 'AuraBites Watermelon Seeds front and back label',
    shopPath: '/shop',
  },
];
