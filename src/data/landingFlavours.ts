import jarCream from '@/assets/motion/cream-onion.png';
import jarSalt from '@/assets/motion/himalayan-salt-pepper.png';
import jarPudina from '@/assets/motion/mint-pudina.png';
import jarPeri from '@/assets/motion/peri-peri.png';
import jarTandoori from '@/assets/motion/tandoori.png';

export interface NutritionRow {
  /** Nutrient label e.g. "Energy" */
  nutrient: string;
  /** Value per 100 g */
  per100g: string;
  /** Value per single 70 g serve */
  per70g: string;
  /** % RDA per serve (dash if not declared) */
  rda: string;
}

export interface NutritionFacts {
  servingSize: string;
  servingsPerJar: string;
  rows: NutritionRow[];
  /** Footnote disclaimer (RDA basis) */
  rdaFootnote: string;
}

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
  sku: string;
  image: string;
  alt: string;
  shopPath: string;
  /** Full ingredients list, label-accurate */
  ingredients: string;
  /** Allergen / contamination warning from label */
  allergen: string;
  /** Per 100 g + per 70 g serve nutrition panel */
  nutrition: NutritionFacts;
}

const sharedAllergen =
  'Product is processed and packed in an integrated nuts and dried fruits unit and may contain occasionally traces of other nuts and dried fruits.';

const sharedFootnote = '*RDA values based on a 2000 kcal diet.';

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
    sku: 'AB-MAK-JAR-PERI',
    image: jarPeri,
    alt: 'AuraBites Peri-Peri makhana jar',
    shopPath: '/shop',
    ingredients:
      'Foxnut, Sugar, Rice Bran Oil, Spices & Condiments (Red Chilli, Dried Mango, Dried Onion, Coriander Seeds, Cumin, Dried Garlic Flakes, Nutmeg, Mace), Himalayan Pink Salt, Maltodextrin, Tomato Powder, Acidity Regulator (INS-330 & INS-296), Hydrolysed Peanut Protein, Colour (INS-160C), Nausadar (INS-510), Nature Identical Flavouring Substances (Peri Peri), Flavour Enhancer (INS-627 & INS-631).',
    allergen: sharedAllergen,
    nutrition: {
      servingSize: '70 g',
      servingsPerJar: '1',
      rdaFootnote: sharedFootnote,
      rows: [
        { nutrient: 'Energy', per100g: '482.15 kcal', per70g: '337.51 kcal', rda: '16.88%' },
        { nutrient: 'Protein', per100g: '10.24 g', per70g: '7.17 g', rda: '—' },
        { nutrient: 'Carbohydrate', per100g: '60.37 g', per70g: '42.26 g', rda: '—' },
        { nutrient: 'Total Sugars', per100g: '4.76 g', per70g: '3.33 g', rda: '—' },
        { nutrient: 'Added Sugars', per100g: '0 g', per70g: '0 g', rda: '—' },
        { nutrient: 'Total Fat', per100g: '22.19 g', per70g: '15.53 g', rda: '23.18%' },
        { nutrient: 'Saturated Fat', per100g: '4.60 g', per70g: '3.22 g', rda: '14.64%' },
        { nutrient: 'Trans Fat', per100g: '0 g', per70g: '0 g', rda: '0%' },
        { nutrient: 'Sodium', per100g: '599.6 mg', per70g: '419.72 mg', rda: '20.99%' },
      ],
    },
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
    sku: 'AB-MAK-JAR-CREAM',
    image: jarCream,
    alt: 'AuraBites Cream and Onion makhana jar',
    shopPath: '/shop',
    ingredients:
      'Foxnut, Sugar, Rice Bran Oil, Spices & Condiments (Onion, Milk Solids), Himalayan Pink Salt, Maltodextrin, Parsley, Yellow Chilli, Garlic, Acidity Regulator (INS-330 & INS-296), Nature Identical Flavouring Substances, Flavour Enhancer (INS-627 & INS-631), Anticaking Agent (INS-551). Contains milk.',
    allergen: sharedAllergen,
    nutrition: {
      servingSize: '70 g',
      servingsPerJar: '1',
      rdaFootnote: sharedFootnote,
      rows: [
        { nutrient: 'Energy', per100g: '470.4 kcal', per70g: '329.34 kcal', rda: '16.47%' },
        { nutrient: 'Protein', per100g: '10.15 g', per70g: '7.11 g', rda: '—' },
        { nutrient: 'Carbohydrate', per100g: '63.35 g', per70g: '44.35 g', rda: '—' },
        { nutrient: 'Total Sugars', per100g: '4.1 g', per70g: '2.87 g', rda: '—' },
        { nutrient: 'Added Sugars', per100g: '0 g', per70g: '0 g', rda: '—' },
        { nutrient: 'Total Fat', per100g: '19.61 g', per70g: '13.73 g', rda: '20.49%' },
        { nutrient: 'Saturated Fat', per100g: '5.24 g', per70g: '3.67 g', rda: '16.68%' },
        { nutrient: 'Trans Fat', per100g: '0 g', per70g: '0 g', rda: '0%' },
        { nutrient: 'Sodium', per100g: '503.3 mg', per70g: '352.31 mg', rda: '17.62%' },
      ],
    },
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
    sku: 'AB-MAK-JAR-MINT',
    image: jarPudina,
    alt: 'AuraBites Mint Pudina makhana jar',
    shopPath: '/shop',
    ingredients:
      'Foxnut, Sugar, Rice Bran Oil, Spices & Condiments (Red Chilli, Coriander Seeds, Dried Mango, Cumin, Turmeric, Dried Ginger, Long Pepper, Fenugreek, Mace, Nutmeg), Himalayan Pink Salt, Black Salt, Mint Leaves, Fenugreek Leaves, Hydrolysed Peanut Protein, Acidity Regulator (INS-330 & INS-296), Nature Identical Flavouring Substances (Spicy Treat), Flavour Enhancer (INS-627 & INS-631), Anticaking Agent (INS-551).',
    allergen: sharedAllergen,
    nutrition: {
      servingSize: '70 g',
      servingsPerJar: '1',
      rdaFootnote: sharedFootnote,
      rows: [
        { nutrient: 'Energy', per100g: '483.11 kcal', per70g: '338.18 kcal', rda: '16.91%' },
        { nutrient: 'Protein', per100g: '10.11 g', per70g: '7.08 g', rda: '—' },
        { nutrient: 'Carbohydrate', per100g: '60.74 g', per70g: '42.52 g', rda: '—' },
        { nutrient: 'Total Sugars', per100g: '1.0 g', per70g: '0.70 g', rda: '—' },
        { nutrient: 'Added Sugars', per100g: '0 g', per70g: '0 g', rda: '—' },
        { nutrient: 'Total Fat', per100g: '22.19 g', per70g: '15.53 g', rda: '23.18%' },
        { nutrient: 'Saturated Fat', per100g: '4.52 g', per70g: '3.16 g', rda: '14.36%' },
        { nutrient: 'Trans Fat', per100g: '0 g', per70g: '0 g', rda: '0%' },
        { nutrient: 'Sodium', per100g: '770.7 mg', per70g: '539.49 mg', rda: '26.97%' },
      ],
    },
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
    sku: 'AB-MAK-JAR-TANDOORI',
    image: jarTandoori,
    alt: 'AuraBites Tandoori Masala makhana jar',
    shopPath: '/shop',
    ingredients:
      'Foxnut, Sugar, Rice Bran Oil, Spices & Condiments (Red Chilli, Dried Onion, Coriander Seeds, Cinnamon, Dried Garlic Flakes, Fenugreek), Himalayan Pink Salt, Acidity Regulator (INS-330), Hydrolysed Peanut Protein, Colour (INS-160C), Nausadar (INS-510), Nature Identical Flavouring Substances (Tandoori Masala), Flavour Enhancer (INS-627 & INS-631), Anticaking Agent (INS-551).',
    allergen: sharedAllergen,
    nutrition: {
      servingSize: '70 g',
      servingsPerJar: '1',
      rdaFootnote: sharedFootnote,
      rows: [
        { nutrient: 'Energy', per100g: '457.46 kcal', per70g: '320.22 kcal', rda: '16.01%' },
        { nutrient: 'Protein', per100g: '9.46 g', per70g: '6.62 g', rda: '—' },
        { nutrient: 'Carbohydrate', per100g: '64.90 g', per70g: '45.43 g', rda: '—' },
        { nutrient: 'Total Sugars', per100g: '2.20 g', per70g: '1.54 g', rda: '—' },
        { nutrient: 'Added Sugars', per100g: '0 g', per70g: '0 g', rda: '—' },
        { nutrient: 'Total Fat', per100g: '17.78 g', per70g: '12.45 g', rda: '18.58%' },
        { nutrient: 'Saturated Fat', per100g: '4.26 g', per70g: '2.98 g', rda: '13.55%' },
        { nutrient: 'Trans Fat', per100g: '0 g', per70g: '0 g', rda: '0%' },
        { nutrient: 'Sodium', per100g: '689.7 mg', per70g: '482.79 mg', rda: '24.14%' },
      ],
    },
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
    sku: 'AB-MAK-JAR-SALT',
    image: jarSalt,
    alt: 'AuraBites Himalayan Salt and Pepper makhana jar',
    shopPath: '/shop',
    ingredients:
      'Foxnut, Sugar, Rice Bran Oil, Black Pepper, Himalayan Pink Salt, Milk Solid, Maltodextrin, Hydrolysed Peanut Protein, Flavour Enhancer (INS-627 & INS-631), Nature Identical Flavouring Substances, Anticaking Agent (INS-551). Contains milk.',
    allergen: sharedAllergen,
    nutrition: {
      servingSize: '70 g',
      servingsPerJar: '1',
      rdaFootnote: sharedFootnote,
      rows: [
        { nutrient: 'Energy', per100g: '462.5 kcal', per70g: '323.75 kcal', rda: '12.1%' },
        { nutrient: 'Protein', per100g: '7.94 g', per70g: '5.56 g', rda: '9.4%' },
        { nutrient: 'Carbohydrate', per100g: '66.84 g', per70g: '46.81 g', rda: '—' },
        { nutrient: 'Total Sugars', per100g: '1.0 g', per70g: '0.70 g', rda: '—' },
        { nutrient: 'Added Sugars', per100g: '0 g', per70g: '0 g', rda: '0%' },
        { nutrient: 'Total Fat', per100g: '18.14 g', per70g: '12.70 g', rda: '16.6%' },
        { nutrient: 'Saturated Fat', per100g: '3.77 g', per70g: '2.64 g', rda: '10.5%' },
        { nutrient: 'Trans Fat', per100g: '0 g', per70g: '0 g', rda: '0%' },
        { nutrient: 'Sodium', per100g: '740.35 mg', per70g: '518.21 mg', rda: '19.3%' },
      ],
    },
  },
];
