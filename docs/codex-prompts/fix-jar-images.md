# Codex prompt — regenerate AuraBites jar product images

Paste the block below into a fresh codex session, in the **frontend** repo
(`aurabites`). It's self-contained — assumes nothing from this conversation.

---

## Prompt

You are working in the AuraBites frontend repo. The goal: regenerate the
**five jar product images** so every label is typo-free, the jar mockups look
like a professional e-commerce product photo set (Amazon / Cred / Allbirds
quality), and the visual style matches the new landing page (cream
background, soft drop-shadow, no rasterised label artifacts).

### Source of truth — DO NOT improvise label text

The brand-approved label artwork is in **`~/Downloads/aurabites-labels/`**
as 5 PDFs:

```
Peri Peri.pdf
Cream & Onion.pdf
Mint Pudina.pdf
Tandoori Masala.pdf
Salt & Pepper.pdf
```

Each PDF is a vector label that includes wordmark, badges, ingredients
panel, and nutrition table. Use these for **every word and every icon** —
never type label copy from memory.

### Bugs to fix in the current jar images

The current renders at `src/assets/motion/*.png` have OCR-style typos that
DO NOT exist in the PDFs. Specifically:

| Jar | Wrong text in current image | Correct (per PDF) |
|---|---|---|
| Peri-Peri | "Pa#h in Fiber" | "Rich in Fiber" |
| Peri-Peri | "Rosated not fried" | "Roasted not fried" |
| Salt & Pepper | "Rich in Pioer" | "Rich in Fiber" |
| Salt & Pepper | "Vital Nutnents" | "Vital Nutrients" |
| Salt & Pepper | "Bune Health" | "Bone Health" |

Re-rendering from the PDF should resolve all of these in one pass — do
not try to retouch the existing PNGs pixel-by-pixel.

### Required output

For each of the 5 flavours, produce **two** assets:

1. `src/assets/motion/<id>.png` — transparent-background jar shot used by
   `AuraMotionStage` and `HeroFlavorCarousel`. Aspect ~1:2, jar centered,
   no shadow baked in, max 800px wide, lossless PNG.
2. `src/assets/jars/<id>-pdp.webp` — cream-background lifestyle product
   shot used on ProductDetailPage. 1600x2000, soft floor-shadow,
   subtle radial spotlight matching the flavour's accent colour.

`<id>` values: `peri`, `cream`, `pudina`, `tandoori`, `salt`.

The jar mock itself is a clear cylindrical PET jar with a screw cap.
The label wraps the front 60% of the jar and is identical to the
corresponding PDF — DO NOT redraw the label, render it directly from the
PDF vector source so every glyph, icon, ingredient line is pixel-correct.

### Constraints

- No watermarks, no R2S2 frame, no manufacturing dimension lines.
  The PDFs are die-line files — strip the white margin + crop guides.
- Maintain ingredient and allergen text exactly as on the PDF.
- Match the new landing page palette: cream `#fff5e1`, accent per-jar
  from `src/data/landingFlavours.ts` (`accent`, `accentSoft`, `accentDeep`).
- Do not change `landingFlavours.ts` — the image paths there are already
  correct, you're just replacing the file contents on disk.
- After replacing, run `npm run build` and confirm no broken imports.

### Done means

- All 5 motion PNGs replaced, file sizes <250 KB each.
- All 5 PDP webp files present, file sizes <300 KB each.
- `npm run build` succeeds.
- Open `dist/index.html` in a preview and visually confirm all five jars
  on the landing page show **Rich in Fiber**, **Roasted not fried**,
  **Vital Nutrients**, **Bone Health** with no typos.
- Commit the changes as a single commit, message: `chore(assets):
  regenerate jar images from approved PDFs (fixes label typos)`.

### What NOT to do

- Do not change `src/components/AuraMotionStage.tsx` or any motion file —
  perf work is locked in there.
- Do not edit `src/data/landingFlavours.ts` ingredient/nutrition fields
  — they were sourced from these same PDFs and verified.
- Do not introduce a new image hosting service. Keep assets in-repo.
