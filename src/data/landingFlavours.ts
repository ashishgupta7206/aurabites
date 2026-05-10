import jarCream from '@/assets/motion/cream-onion.png';
import jarSalt from '@/assets/motion/himalayan-salt-pepper.png';
import jarPudina from '@/assets/motion/mint-pudina.png';
import jarPeri from '@/assets/motion/peri-peri.png';
import jarTandoori from '@/assets/motion/tandoori.png';

export interface LandingFlavor {
  id: string;
  name: string;
  shortName: string;
  tag: string;
  accent: string;
  accentSoft: string;
  accentDeep: string;
  description: string;
  notes: string;
  kcal: number;
  protein: string;
  image: string;
  alt: string;
  shopPath: string;
}

export const landingFlavours: LandingFlavor[] = [
  {
    id: 'peri',
    name: 'Peri-Peri',
    shortName: 'Peri',
    tag: 'Fiery Heat',
    accent: '#E84F1A',
    accentSoft: '#FFB347',
    accentDeep: '#7C220D',
    description: 'Fiery, tangy and bold - made for spice lovers.',
    notes: 'Chilli heat, tangy lime, smoked paprika, roasted crunch.',
    kcal: 128,
    protein: '9.2g',
    image: jarPeri,
    alt: 'AuraBites Peri-Peri makhana jar',
    shopPath: '/shop',
  },
  {
    id: 'cream',
    name: 'Cream & Onion',
    shortName: 'Cream',
    tag: 'Cool Classic',
    accent: '#3FA9C9',
    accentSoft: '#A8E1F2',
    accentDeep: '#175C72',
    description: 'Creamy, savoury and smooth with a classic onion kick.',
    notes: 'Sweet onion, creamy herbs, white pepper, clean finish.',
    kcal: 124,
    protein: '9.0g',
    image: jarCream,
    alt: 'AuraBites Cream and Onion makhana jar',
    shopPath: '/shop',
  },
  {
    id: 'pudina',
    name: 'Mint Pudina',
    shortName: 'Pudina',
    tag: 'Fresh Zing',
    accent: '#3D9A4E',
    accentSoft: '#A8DDB1',
    accentDeep: '#175D28',
    description: 'Fresh, herby and cooling with a desi mint twist.',
    notes: 'Pudina leaf, black salt, amchur, cumin, green chilli.',
    kcal: 118,
    protein: '9.4g',
    image: jarPudina,
    alt: 'AuraBites Mint Pudina makhana jar',
    shopPath: '/shop',
  },
  {
    id: 'tandoori',
    name: 'Tandoori Masala',
    shortName: 'Tandoori',
    tag: 'Smoky Spice',
    accent: '#A33323',
    accentSoft: '#E89070',
    accentDeep: '#58190F',
    description: 'Smoky, spicy and full of Indian tandoori flavour.',
    notes: 'Kashmiri chilli, kasuri methi, garlic, roasted masala.',
    kcal: 132,
    protein: '9.1g',
    image: jarTandoori,
    alt: 'AuraBites Tandoori Masala makhana jar',
    shopPath: '/shop',
  },
  {
    id: 'salt',
    name: 'Himalayan Salt & Pepper',
    shortName: 'Salt',
    tag: 'Clean Seasoning',
    accent: '#D9879C',
    accentSoft: '#F5C8D2',
    accentDeep: '#854559',
    description: 'Simple, clean and perfectly seasoned.',
    notes: 'Pink Himalayan salt, cracked pepper, light garlic note.',
    kcal: 120,
    protein: '9.3g',
    image: jarSalt,
    alt: 'AuraBites Himalayan Salt and Pepper makhana jar',
    shopPath: '/shop',
  },
];
