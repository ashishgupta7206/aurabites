import type { LandingFlavor } from '@/data/landingFlavours';

interface Props {
  flavour: LandingFlavor;
  /** Optional className applied to the outer wrapper */
  className?: string;
}

/**
 * Label-accurate nutrition + ingredients block for a single flavour.
 * Renders the per-100g / per-70g serve table and the ingredients list.
 * Uses the flavour's accent color for the heading band.
 */
export const NutritionFactsCard = ({ flavour, className }: Props) => {
  const { nutrition, ingredients, allergen, accent } = flavour;

  return (
    <div
      className={`rounded-2xl bg-white text-[#160d09] shadow-[0_10px_30px_rgba(0,0,0,0.18)] overflow-hidden ${className ?? ''}`}
    >
      <div
        className="px-5 py-3 text-white font-display font-bold text-base tracking-wide"
        style={{ background: accent }}
      >
        Nutrition Facts
        <span className="ml-2 text-xs font-medium opacity-90">
          Serving: {nutrition.servingSize} ({nutrition.servingsPerJar} jar)
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#fff5e1] text-[#5a4836]">
            <tr>
              <th className="px-4 py-2 text-left font-semibold">Nutrient</th>
              <th className="px-4 py-2 text-right font-semibold">Per 100 g</th>
              <th className="px-4 py-2 text-right font-semibold">Per Serve (70 g)</th>
              <th className="px-4 py-2 text-right font-semibold">% RDA</th>
            </tr>
          </thead>
          <tbody>
            {nutrition.rows.map((row) => (
              <tr key={row.nutrient} className="border-t border-[#f0e3c8] last:border-b last:border-[#f0e3c8]">
                <td className="px-4 py-2 font-medium">{row.nutrient}</td>
                <td className="px-4 py-2 text-right tabular-nums">{row.per100g}</td>
                <td className="px-4 py-2 text-right tabular-nums">{row.per70g}</td>
                <td className="px-4 py-2 text-right tabular-nums text-[#5a4836]">{row.rda}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-5 py-4 bg-[#fffaf0] text-xs leading-5 text-[#5a4836]">
        <p>{nutrition.rdaFootnote}</p>
      </div>

      <div className="px-5 py-4 space-y-3 text-sm leading-6">
        <div>
          <p className="font-bold mb-1 text-[#160d09]">Ingredients</p>
          <p className="text-[#5a4836]">{ingredients}</p>
        </div>
        <div>
          <p className="font-bold mb-1 text-[#160d09]">Allergen advice</p>
          <p className="text-[#5a4836] text-xs">{allergen}</p>
        </div>
      </div>
    </div>
  );
};
