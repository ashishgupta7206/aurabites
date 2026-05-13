from __future__ import annotations

import argparse
import json
import math
import random
import shutil
import zipfile
from pathlib import Path

import fitz
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_OUTPUT = Path.home() / "Downloads" / "aurabites-product-catalog"
DEFAULT_FRONT_DIR = Path.home() / "Downloads" / "dd"
DEFAULT_LABEL_ZIP = Path.home() / "Downloads" / "drive-download-20260512T181608Z-3-001.zip"


FLAVOURS = [
    {
        "key": "peri-peri",
        "name": "Peri-Peri",
        "productName": "AuraBites Makhana - Peri-Peri",
        "sku": "AB-MAK-JAR-PERI",
        "tag": "Fiery Heat",
        "accent": "#E84F1A",
        "deep": "#7C220D",
        "soft": "#FFE0C8",
        "description": "Fiery, tangy and bold - made for spice lovers.",
        "notes": "Chilli heat, tangy lime, smoked paprika, roasted crunch.",
        "front": "peri peri.jpg",
        "cutout": "peri-peri.png",
        "label": "Peri Peri.pdf",
        "mktStatus": "BEST_SELLER",
        "sort": 1,
    },
    {
        "key": "cream-onion",
        "name": "Cream & Onion",
        "productName": "AuraBites Makhana - Cream & Onion",
        "sku": "AB-MAK-JAR-CREAM",
        "tag": "Cool Classic",
        "accent": "#3FA9C9",
        "deep": "#175C72",
        "soft": "#DDF4F7",
        "description": "Creamy, savoury and smooth with a classic onion kick.",
        "notes": "Sweet onion, creamy herbs, white pepper, clean finish.",
        "front": "Cream and Onion 1 (1).jpg",
        "cutout": "cream-onion.png",
        "label": "Cream & Onion.pdf",
        "mktStatus": "FEATURED",
        "sort": 2,
    },
    {
        "key": "mint-pudina",
        "name": "Mint Pudina",
        "productName": "AuraBites Makhana - Mint Pudina",
        "sku": "AB-MAK-JAR-MINT",
        "tag": "Fresh Zing",
        "accent": "#3D9A4E",
        "deep": "#175D28",
        "soft": "#DCF4DD",
        "description": "Fresh, herby and cooling with a desi mint twist.",
        "notes": "Pudina leaf, black salt, amchur, cumin, green chilli.",
        "front": "ChatGPT Image Jan 9, 2026, 04_53_48 AM.png",
        "cutout": "mint-pudina.png",
        "label": "Mint Pudina.pdf",
        "mktStatus": "NEW_LAUNCH",
        "sort": 3,
    },
    {
        "key": "tandoori-masala",
        "name": "Tandoori Masala",
        "productName": "AuraBites Makhana - Tandoori Masala",
        "sku": "AB-MAK-JAR-TANDOORI",
        "tag": "Smoky Spice",
        "accent": "#A33323",
        "deep": "#58190F",
        "soft": "#FFE1D7",
        "description": "Smoky, spicy and full of Indian tandoori flavour.",
        "notes": "Kashmiri chilli, kasuri methi, garlic, roasted masala.",
        "front": "TANDOORI 1.png",
        "cutout": "tandoori.png",
        "label": "Tandoori Masala.pdf",
        "mktStatus": "TRENDING",
        "sort": 4,
    },
    {
        "key": "himalayan-salt-pepper",
        "name": "Himalayan Salt & Pepper",
        "productName": "AuraBites Makhana - Himalayan Salt & Pepper",
        "sku": "AB-MAK-JAR-SALT",
        "tag": "Clean Seasoning",
        "accent": "#D9879C",
        "deep": "#854559",
        "soft": "#FCE0E8",
        "description": "Simple, clean and perfectly seasoned.",
        "notes": "Pink Himalayan salt, cracked pepper, light garlic note.",
        "front": "Himalayan Salt and pepper.jpg",
        "cutout": "himalayan-salt-pepper.png",
        "label": "Salt & Pepper.pdf",
        "mktStatus": "FEATURED",
        "sort": 5,
    },
]


BENEFITS = [
    "No Palm Oil",
    "Roasted, Not Fried",
    "Rich in Fiber",
    "12 Vital Nutrients",
    "Bone Health",
    "Heart Health",
]


def font(name: str, size: int) -> ImageFont.FreeTypeFont:
    candidates = [
        Path("C:/Windows/Fonts") / name,
        Path("C:/Windows/Fonts/arial.ttf"),
        Path("C:/Windows/Fonts/arialbd.ttf"),
    ]
    for candidate in candidates:
        if candidate.exists():
            return ImageFont.truetype(str(candidate), size=size)
    return ImageFont.load_default()


FONT_BOLD = lambda size: font("arialbd.ttf", size)
FONT_REG = lambda size: font("arial.ttf", size)


def hex_to_rgb(value: str) -> tuple[int, int, int]:
    value = value.lstrip("#")
    return tuple(int(value[i : i + 2], 16) for i in (0, 2, 4))


def gradient(size: tuple[int, int], top: str, bottom: str) -> Image.Image:
    w, h = size
    top_rgb = hex_to_rgb(top)
    bottom_rgb = hex_to_rgb(bottom)
    img = Image.new("RGB", size)
    draw = ImageDraw.Draw(img)
    for y in range(h):
        t = y / max(1, h - 1)
        rgb = tuple(int(top_rgb[i] * (1 - t) + bottom_rgb[i] * t) for i in range(3))
        draw.line([(0, y), (w, y)], fill=rgb)
    return img.convert("RGBA")


def rounded_mask(size: tuple[int, int], radius: int) -> Image.Image:
    mask = Image.new("L", size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, size[0], size[1]), radius=radius, fill=255)
    return mask


def fit(img: Image.Image, box: tuple[int, int], mode: str = "contain") -> Image.Image:
    img = img.convert("RGBA")
    w, h = img.size
    bw, bh = box
    scale = max(bw / w, bh / h) if mode == "cover" else min(bw / w, bh / h)
    return img.resize((int(w * scale), int(h * scale)), Image.Resampling.LANCZOS)


def paste_center(canvas: Image.Image, img: Image.Image, center: tuple[int, int], opacity: float = 1.0) -> None:
    img = img.convert("RGBA")
    if opacity < 1:
        alpha = img.getchannel("A").point(lambda p: int(p * opacity))
        img.putalpha(alpha)
    x = int(center[0] - img.width / 2)
    y = int(center[1] - img.height / 2)
    canvas.alpha_composite(img, (x, y))


def draw_wrapped(draw: ImageDraw.ImageDraw, text: str, box: tuple[int, int, int, int], fill, fnt, spacing=10) -> None:
    x1, y1, x2, _ = box
    words = text.split()
    lines: list[str] = []
    line = ""
    for word in words:
        test = f"{line} {word}".strip()
        if draw.textbbox((0, 0), test, font=fnt)[2] <= x2 - x1:
            line = test
        else:
            if line:
                lines.append(line)
            line = word
    if line:
        lines.append(line)
    y = y1
    for line in lines:
        draw.text((x1, y), line, font=fnt, fill=fill)
        y += fnt.size + spacing


def save_webp(img: Image.Image, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    img.convert("RGB").save(path, format="WEBP", quality=90, method=6)


def render_label(pdf_path: Path) -> Image.Image:
    doc = fitz.open(pdf_path)
    page = doc[0]
    scale = 3
    pix = page.get_pixmap(matrix=fitz.Matrix(scale, scale), alpha=False)
    img = Image.frombytes("RGB", (pix.width, pix.height), pix.samples).convert("RGBA")
    doc.close()
    crop = (
        int(70 * scale),
        int(112 * scale),
        int(835 * scale),
        int(485 * scale),
    )
    return img.crop(crop)


def label_back_panel(label: Image.Image) -> Image.Image:
    w, h = label.size
    left = label.crop((int(w * 0.02), int(h * 0.12), int(w * 0.30), int(h * 0.88)))
    right = label.crop((int(w * 0.70), int(h * 0.12), int(w * 0.98), int(h * 0.88)))
    panel = Image.new("RGBA", (left.width + right.width + 38, max(left.height, right.height)), (255, 247, 230, 255))
    panel.alpha_composite(left, (0, 0))
    panel.alpha_composite(right, (left.width + 38, 0))
    return panel


def shadow(size: tuple[int, int], blur: int, color=(0, 0, 0, 110)) -> Image.Image:
    img = Image.new("RGBA", size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    draw.ellipse((0, 0, size[0], size[1]), fill=color)
    return img.filter(ImageFilter.GaussianBlur(blur))


def makhana_piece(size: int, seed: int, accent: str | None = None) -> Image.Image:
    rng = random.Random(seed)
    pad = max(6, size // 8)
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    base = (238 + rng.randint(-8, 8), 226 + rng.randint(-10, 8), 193 + rng.randint(-8, 8), 255)
    d.ellipse((pad, pad, size - pad, size - pad), fill=base)
    for _ in range(24):
        x = rng.randint(pad, size - pad)
        y = rng.randint(pad, size - pad)
        r = rng.randint(2, max(3, size // 22))
        col = (151 + rng.randint(-20, 18), 119 + rng.randint(-18, 12), 73 + rng.randint(-15, 15), rng.randint(55, 105))
        d.ellipse((x - r, y - r, x + r, y + r), fill=col)
    if accent:
        ar, ag, ab = hex_to_rgb(accent)
        for _ in range(12):
            x = rng.randint(pad, size - pad)
            y = rng.randint(pad, size - pad)
            r = rng.randint(1, max(2, size // 32))
            d.ellipse((x - r, y - r, x + r, y + r), fill=(ar, ag, ab, rng.randint(80, 135)))
    img = img.filter(ImageFilter.GaussianBlur(0.25))
    return img


def draw_makhana_cluster(canvas: Image.Image, flavour: dict, region: tuple[int, int, int, int], count: int, seed: int) -> None:
    rng = random.Random(seed)
    x1, y1, x2, y2 = region
    for i in range(count):
        size = rng.randint(62, 118)
        p = makhana_piece(size, seed * 100 + i, flavour["accent"])
        x = rng.randint(x1, max(x1, x2 - size))
        y = rng.randint(y1, max(y1, y2 - size))
        canvas.alpha_composite(p, (x, y))


def ingredient_marks(canvas: Image.Image, flavour: dict, seed: int, intensity: int = 40) -> None:
    rng = random.Random(seed)
    d = ImageDraw.Draw(canvas, "RGBA")
    accent = hex_to_rgb(flavour["accent"])
    deep = hex_to_rgb(flavour["deep"])
    for _ in range(intensity):
        x = rng.randint(70, canvas.width - 70)
        y = rng.randint(90, canvas.height - 90)
        r = rng.randint(2, 8)
        d.ellipse((x - r, y - r, x + r, y + r), fill=(*accent, rng.randint(35, 95)))
    if "mint" in flavour["key"]:
        for _ in range(14):
            x, y = rng.randint(110, 1450), rng.randint(150, 1330)
            d.ellipse((x - 34, y - 12, x + 34, y + 12), fill=(*accent, 150), outline=(*deep, 170), width=2)
            d.line((x - 26, y, x + 26, y), fill=(245, 255, 230, 160), width=2)
    elif "cream" in flavour["key"]:
        for _ in range(11):
            x, y = rng.randint(120, 1460), rng.randint(180, 1320)
            d.ellipse((x - 36, y - 36, x + 36, y + 36), outline=(*deep, 115), width=9)
    elif "salt" in flavour["key"]:
        for _ in range(28):
            x, y = rng.randint(110, 1480), rng.randint(140, 1370)
            pts = [(x, y - 14), (x + 14, y), (x, y + 14), (x - 14, y)]
            d.polygon(pts, fill=(*accent, 125))
    else:
        for _ in range(7):
            x, y = rng.randint(100, 1450), rng.randint(160, 1330)
            d.rounded_rectangle((x - 16, y - 60, x + 16, y + 60), radius=16, fill=(*accent, 145), outline=(*deep, 170), width=3)


def packshot(flavour: dict, cutout_path: Path) -> Image.Image:
    canvas = gradient((1600, 1600), "#fffaf0", "#f7efe2")
    d = ImageDraw.Draw(canvas, "RGBA")
    d.ellipse((390, 1295, 1210, 1448), fill=(40, 25, 10, 42))
    d.ellipse((315, 1320, 1285, 1505), fill=(40, 25, 10, 22))
    jar = fit(Image.open(cutout_path), (760, 1280), "contain")
    paste_center(canvas, jar, (800, 785))
    d.rounded_rectangle((80, 80, 470, 168), radius=44, fill=(255, 255, 255, 185))
    d.text((126, 108), "AURABITES MAKHANA", font=FONT_BOLD(30), fill=(61, 39, 22, 230))
    return canvas


def back_label_jar(flavour: dict, label: Image.Image) -> Image.Image:
    canvas = gradient((1600, 1600), "#fbf5e8", flavour["soft"])
    d = ImageDraw.Draw(canvas, "RGBA")
    ingredient_marks(canvas, flavour, flavour["sort"] * 99, 28)
    d.ellipse((430, 1280, 1170, 1440), fill=(40, 28, 15, 38))
    jar_box = (515, 145, 1085, 1375)
    d.rounded_rectangle(jar_box, radius=110, fill=(255, 255, 255, 92), outline=(220, 220, 210, 170), width=7)
    d.rounded_rectangle((492, 100, 1108, 255), radius=70, fill=(245, 245, 238, 150), outline=(205, 205, 198, 170), width=5)
    draw_makhana_cluster(canvas, flavour, (548, 265, 1035, 455), 16, flavour["sort"] * 31)
    draw_makhana_cluster(canvas, flavour, (548, 1110, 1035, 1295), 14, flavour["sort"] * 41)
    panel = label_back_panel(label)
    panel = fit(panel, (660, 610), "contain")
    holder = Image.new("RGBA", (730, 675), (0, 0, 0, 0))
    mask = rounded_mask(holder.size, 34)
    bg = Image.new("RGBA", holder.size, (255, 250, 235, 244))
    holder.alpha_composite(bg)
    paste_center(holder, panel, (holder.width // 2, holder.height // 2))
    holder.putalpha(mask)
    canvas.alpha_composite(holder, (435, 520))
    d.rounded_rectangle((435, 520, 1165, 1195), radius=34, outline=(*hex_to_rgb(flavour["accent"]), 155), width=5)
    d.rounded_rectangle((610, 402, 990, 460), radius=29, fill=(*hex_to_rgb(flavour["deep"]), 230))
    tw = d.textbbox((0, 0), "BACK LABEL", font=FONT_BOLD(28))[2]
    d.text((800 - tw / 2, 416), "BACK LABEL", font=FONT_BOLD(28), fill=(255, 247, 226, 255))
    d.rounded_rectangle((950, 170, 1005, 1320), radius=28, fill=(255, 255, 255, 42))
    return canvas


def angled_detail(flavour: dict, cutout_path: Path) -> Image.Image:
    canvas = gradient((1600, 1600), "#160d09", flavour["deep"])
    d = ImageDraw.Draw(canvas, "RGBA")
    d.ellipse((260, 1160, 1340, 1475), fill=(0, 0, 0, 95))
    d.ellipse((430, 300, 1180, 1160), fill=(*hex_to_rgb(flavour["accent"]), 34))
    ingredient_marks(canvas, flavour, flavour["sort"] * 167, 54)
    jar = fit(Image.open(cutout_path), (760, 1310), "contain")
    jar = jar.rotate(-5, expand=True, resample=Image.Resampling.BICUBIC)
    paste_center(canvas, jar, (800, 820))
    d.rounded_rectangle((86, 1110, 650, 1390), radius=54, fill=(255, 247, 226, 220))
    d.text((132, 1158), flavour["tag"].upper(), font=FONT_BOLD(30), fill=hex_to_rgb(flavour["accent"]))
    draw_wrapped(d, flavour["notes"], (132, 1210, 586, 1370), (61, 39, 22, 255), FONT_REG(42), 10)
    return canvas


def closeup(flavour: dict, front_path: Path) -> Image.Image:
    canvas = gradient((1600, 1600), "#fffaf0", flavour["soft"])
    source = Image.open(front_path).convert("RGBA")
    crop = source.crop((0, int(source.height * 0.48), source.width, int(source.height * 0.92)))
    bg = fit(crop, (1800, 1450), "cover").filter(ImageFilter.GaussianBlur(1.1))
    paste_center(canvas, bg, (800, 820), 0.92)
    overlay = Image.new("RGBA", (1600, 1600), (255, 246, 226, 35))
    canvas.alpha_composite(overlay)
    draw_makhana_cluster(canvas, flavour, (100, 230, 1500, 1250), 30, flavour["sort"] * 59)
    d = ImageDraw.Draw(canvas, "RGBA")
    d.rounded_rectangle((116, 1160, 1484, 1420), radius=58, fill=(22, 14, 10, 210))
    d.text((180, 1215), "ROASTED CRUNCH CLOSE-UP", font=FONT_BOLD(42), fill=(255, 247, 226, 255))
    draw_wrapped(d, flavour["description"], (180, 1278, 1320, 1390), (232, 215, 188, 255), FONT_REG(38), 10)
    return canvas


def benefits_tile(flavour: dict, cutout_path: Path) -> Image.Image:
    canvas = gradient((1600, 1600), "#fff7ea", "#efe0c8")
    d = ImageDraw.Draw(canvas, "RGBA")
    jar = fit(Image.open(cutout_path), (590, 1140), "contain")
    paste_center(canvas, jar, (1220, 885))
    d.text((120, 140), "Snack light.", font=FONT_BOLD(86), fill=(57, 37, 24, 255))
    d.text((120, 240), "Crunch right.", font=FONT_BOLD(86), fill=hex_to_rgb(flavour["accent"]))
    for idx, benefit in enumerate(BENEFITS):
        x = 126 + (idx % 2) * 430
        y = 410 + (idx // 2) * 210
        d.rounded_rectangle((x, y, x + 360, y + 142), radius=34, fill=(255, 255, 255, 205), outline=(*hex_to_rgb(flavour["accent"]), 80), width=2)
        d.ellipse((x + 28, y + 35, x + 98, y + 105), fill=(*hex_to_rgb(flavour["accent"]), 230))
        d.text((x + 118, y + 38), benefit, font=FONT_BOLD(31), fill=(57, 37, 24, 255))
    return canvas


def lifestyle(flavour: dict, cutout_path: Path) -> Image.Image:
    canvas = gradient((1600, 1600), "#1a100b", "#302117")
    d = ImageDraw.Draw(canvas, "RGBA")
    d.rounded_rectangle((90, 1010, 1510, 1510), radius=80, fill=(246, 224, 191, 230))
    d.ellipse((170, 1010, 1020, 1410), fill=(225, 198, 156, 255), outline=(135, 91, 48, 170), width=10)
    d.ellipse((235, 1055, 955, 1355), fill=(255, 248, 230, 255))
    draw_makhana_cluster(canvas, flavour, (260, 1060, 920, 1305), 28, flavour["sort"] * 79)
    jar = fit(Image.open(cutout_path), (610, 1150), "contain")
    paste_center(canvas, jar, (1120, 760))
    ingredient_marks(canvas, flavour, flavour["sort"] * 197, 65)
    d.rounded_rectangle((118, 118, 718, 386), radius=58, fill=(255, 247, 226, 218))
    d.text((168, 168), flavour["name"], font=FONT_BOLD(58), fill=hex_to_rgb(flavour["accent"]))
    draw_wrapped(d, flavour["description"], (168, 245, 640, 360), (58, 38, 24, 255), FONT_REG(35), 8)
    return canvas


def family_lockup(flavour: dict, cutout_paths: dict[str, Path]) -> Image.Image:
    canvas = gradient((1600, 1600), "#100a07", "#2b1a11")
    d = ImageDraw.Draw(canvas, "RGBA")
    d.text((110, 106), "AURABITES", font=FONT_BOLD(44), fill=(255, 247, 226, 220))
    d.text((110, 158), "ROASTED MAKHANA", font=FONT_BOLD(74), fill=(255, 247, 226, 255))
    d.rounded_rectangle((110, 260, 615, 330), radius=35, fill=(*hex_to_rgb(flavour["accent"]), 230))
    d.text((150, 276), f"{flavour['name'].upper()} HIGHLIGHT", font=FONT_BOLD(28), fill=(255, 247, 226, 255))
    positions = [335, 590, 800, 1010, 1265]
    for item, x in zip(FLAVOURS, positions):
        is_active = item["key"] == flavour["key"]
        max_box = (400, 980) if is_active else (310, 830)
        jar = fit(Image.open(cutout_paths[item["key"]]), max_box, "contain")
        if not is_active:
            jar = ImageOps.grayscale(jar.convert("RGB")).convert("RGBA")
            jar.putalpha(jar.getchannel("A") if "A" in jar.getbands() else 210)
            opacity = 0.62
        else:
            opacity = 1.0
            d.ellipse((x - 285, 375, x + 285, 1305), fill=(*hex_to_rgb(item["accent"]), 50))
        paste_center(canvas, jar, (x, 890), opacity)
    d.ellipse((165, 1280, 1435, 1500), fill=(0, 0, 0, 120))
    return canvas


def generate(args: argparse.Namespace) -> dict:
    output = Path(args.output)
    if output.exists() and args.clean:
        shutil.rmtree(output)
    output.mkdir(parents=True, exist_ok=True)

    labels_dir = output / "_labels"
    labels_dir.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(Path(args.label_zip)) as zf:
        zf.extractall(labels_dir)

    cutout_paths = {f["key"]: ROOT / "src" / "assets" / "motion" / f["cutout"] for f in FLAVOURS}
    manifest = {
        "category": {
            "name": "Roasted Makhana",
            "description": "Premium roasted makhana jars in bold Indian-inspired flavours.",
            "status": "ACTIVE",
        },
        "pricing": {"mrp": 299, "price": 199, "discountPercent": 33.44},
        "products": [],
    }

    for flavour in FLAVOURS:
        front_path = Path(args.front_dir) / flavour["front"]
        label = render_label(labels_dir / flavour["label"])
        cutout_path = cutout_paths[flavour["key"]]
        asset_dir = output / flavour["key"]

        assets = [
            ("01-front-packshot", "Front jar packshot", packshot(flavour, cutout_path)),
            ("02-back-label-jar", "Back label on jar", back_label_jar(flavour, label)),
            ("03-angled-detail", "Premium angled jar detail", angled_detail(flavour, cutout_path)),
            ("04-roasted-closeup", "Roasted makhana close-up", closeup(flavour, front_path)),
            ("05-benefits", "AuraBites benefits tile", benefits_tile(flavour, cutout_path)),
            ("06-lifestyle", "Serving and flavour lifestyle", lifestyle(flavour, cutout_path)),
            ("07-family-lockup", "AuraBites five flavour family lockup", family_lockup(flavour, cutout_paths)),
        ]

        images = []
        for order, (slug, alt, img) in enumerate(assets, start=1):
            path = asset_dir / f"{slug}.webp"
            save_webp(img, path)
            images.append(
                {
                    "sortOrder": order,
                    "kind": slug,
                    "alt": f"{alt} - AuraBites {flavour['name']} Makhana",
                    "localPath": str(path),
                    "publicId": f"aurabites/products/roasted-makhana/{flavour['key']}/{slug}",
                }
            )

        manifest["products"].append(
            {
                "key": flavour["key"],
                "name": flavour["productName"],
                "flavourName": flavour["name"],
                "sku": flavour["sku"],
                "tag": flavour["tag"],
                "accent": flavour["accent"],
                "description": flavour["description"],
                "longDescription": (
                    f"{flavour['description']} AuraBites brings a clean, light roasted makhana "
                    "snack with satisfying crunch and bold Indian-inspired seasoning."
                ),
                "mktStatus": flavour["mktStatus"],
                "sortOrder": flavour["sort"],
                "images": images,
            }
        )

    category = family_lockup(FLAVOURS[0], cutout_paths)
    category_path = output / "roasted-makhana-category.webp"
    save_webp(category, category_path)
    manifest["categoryImage"] = {
        "localPath": str(category_path),
        "publicId": "aurabites/products/roasted-makhana/category-lockup",
        "alt": "AuraBites roasted makhana five flavour jar family",
    }

    manifest_path = output / "aurabites-catalog-manifest.json"
    manifest_path.write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    return {"output": str(output), "manifest": str(manifest_path)}


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate AuraBites catalog image assets.")
    parser.add_argument("--output", default=str(DEFAULT_OUTPUT))
    parser.add_argument("--front-dir", default=str(DEFAULT_FRONT_DIR))
    parser.add_argument("--label-zip", default=str(DEFAULT_LABEL_ZIP))
    parser.add_argument("--clean", action="store_true")
    result = generate(parser.parse_args())
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
