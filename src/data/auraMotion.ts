import creamOnion from '@/assets/motion/cream-onion.png';
import himalayanSalt from '@/assets/motion/himalayan-salt-pepper.png';
import mintPudina from '@/assets/motion/mint-pudina.png';
import periPeri from '@/assets/motion/peri-peri.png';
import tandoori from '@/assets/motion/tandoori.png';

export type MotionIngredient = 'chilli' | 'leaf' | 'onion' | 'salt' | 'spice';

export interface MotionProduct {
  id: string;
  name: string;
  shortName: string;
  image: string;
  accent: string;
  accentSoft: string;
  ingredient: MotionIngredient;
  finalX: number;
  finalY: number;
  finalRotate: number;
  finalScale: number;
}

export interface MotionDot {
  id: number;
  angle: number;
  radius: number;
  lift: number;
  size: number;
  speed: number;
  colorSlot: number;
}

export interface MotionMakhana {
  id: number;
  angle: number;
  radius: number;
  size: number;
  delay: number;
  spin: number;
}

export interface MotionAccent {
  id: number;
  type: MotionIngredient;
  angle: number;
  radius: number;
  size: number;
  speed: number;
}

export const motionProducts: MotionProduct[] = [
  {
    id: 'peri',
    name: 'Peri-Peri',
    shortName: 'Peri',
    image: periPeri,
    accent: '#f05a2a',
    accentSoft: '#ffbd6c',
    ingredient: 'chilli',
    finalX: 0,
    finalY: -10,
    finalRotate: 0,
    finalScale: 0.78,
  },
  {
    id: 'tandoori',
    name: 'Tandoori Masala',
    shortName: 'Tandoori',
    image: tandoori,
    accent: '#bd3529',
    accentSoft: '#ff9a48',
    ingredient: 'spice',
    finalX: -170,
    finalY: 10,
    finalRotate: -7,
    finalScale: 0.63,
  },
  {
    id: 'mint',
    name: 'Mint Pudina',
    shortName: 'Mint',
    image: mintPudina,
    accent: '#54b653',
    accentSoft: '#a2e46d',
    ingredient: 'leaf',
    finalX: 170,
    finalY: 10,
    finalRotate: 7,
    finalScale: 0.63,
  },
  {
    id: 'cream',
    name: 'Cream & Onion',
    shortName: 'Cream',
    image: creamOnion,
    accent: '#39a9d8',
    accentSoft: '#c5f2ff',
    ingredient: 'onion',
    finalX: 318,
    finalY: 42,
    finalRotate: 13,
    finalScale: 0.53,
  },
  {
    id: 'salt',
    name: 'Himalayan Salt & Pepper',
    shortName: 'Salt',
    image: himalayanSalt,
    accent: '#d8729a',
    accentSoft: '#ffd0dd',
    ingredient: 'salt',
    finalX: -318,
    finalY: 42,
    finalRotate: -13,
    finalScale: 0.53,
  },
];

const rand = (seed: number) => {
  const x = Math.sin(seed * 999.91) * 10000;
  return x - Math.floor(x);
};

export const motionDots: MotionDot[] = Array.from({ length: 96 }, (_, index) => ({
  id: index,
  angle: rand(index + 1) * Math.PI * 2,
  radius: 120 + rand(index + 17) * 410,
  lift: -170 + rand(index + 31) * 340,
  size: 0.42 + rand(index + 47) * 1.2,
  speed: -1.1 + rand(index + 63) * 2.5,
  colorSlot: index % motionProducts.length,
}));

export const motionMakhana: MotionMakhana[] = Array.from({ length: 12 }, (_, index) => ({
  id: index,
  angle: (index / 12) * Math.PI * 2 + rand(index + 101) * 0.5,
  radius: 80 + rand(index + 113) * 270,
  size: 0.58 + rand(index + 127) * 0.58,
  delay: rand(index + 139) * 0.16,
  spin: -170 + rand(index + 151) * 340,
}));

const ingredientTypes: MotionIngredient[] = ['chilli', 'spice', 'leaf', 'onion', 'salt'];

export const motionAccents: MotionAccent[] = Array.from({ length: 24 }, (_, index) => ({
  id: index,
  type: ingredientTypes[index % ingredientTypes.length],
  angle: rand(index + 201) * Math.PI * 2,
  radius: 180 + rand(index + 213) * 340,
  size: 0.5 + rand(index + 227) * 0.65,
  speed: (rand(index + 239) > 0.5 ? 1 : -1) * (0.55 + rand(index + 241) * 0.8),
}));

export const clampMotion = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
export const lerpMotion = (a: number, b: number, t: number) => a + (b - a) * clampMotion(t);
export const smoothMotion = (edge0: number, edge1: number, value: number) => {
  const t = clampMotion((value - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};
