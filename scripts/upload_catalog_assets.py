from __future__ import annotations

import argparse
import hashlib
import json
import os
import time
from pathlib import Path

import requests


def sign(params: dict[str, str], api_secret: str) -> str:
    payload = "&".join(f"{key}={params[key]}" for key in sorted(params) if params[key] not in (None, ""))
    return hashlib.sha1((payload + api_secret).encode("utf-8")).hexdigest()


def upload_image(path: Path, public_id: str, cloud_name: str, api_key: str, api_secret: str) -> str:
    timestamp = str(int(time.time()))
    params = {
        "overwrite": "true",
        "public_id": public_id,
        "tags": "aurabites,roasted-makhana,catalog",
        "timestamp": timestamp,
    }
    data = {
        **params,
        "api_key": api_key,
        "signature": sign(params, api_secret),
    }
    url = f"https://api.cloudinary.com/v1_1/{cloud_name}/image/upload"
    with path.open("rb") as handle:
        response = requests.post(url, data=data, files={"file": handle}, timeout=90)
    response.raise_for_status()
    payload = response.json()
    return payload["secure_url"]


def iter_images(manifest: dict):
    if manifest.get("categoryImage"):
        yield manifest["categoryImage"]
    for product in manifest.get("products", []):
        yield from product.get("images", [])


def main() -> None:
    parser = argparse.ArgumentParser(description="Upload generated AuraBites catalog assets to Cloudinary.")
    parser.add_argument("manifest", help="Path to aurabites-catalog-manifest.json")
    parser.add_argument("--output", help="Output path for Cloudinary URL manifest")
    args = parser.parse_args()

    cloud_name = os.environ.get("CLOUDINARY_CLOUD_NAME")
    api_key = os.environ.get("CLOUDINARY_API_KEY")
    api_secret = os.environ.get("CLOUDINARY_API_SECRET")
    if not all([cloud_name, api_key, api_secret]):
        raise SystemExit("Missing CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, or CLOUDINARY_API_SECRET.")

    manifest_path = Path(args.manifest)
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))

    for image in iter_images(manifest):
        local_path = Path(image["localPath"])
        secure_url = upload_image(local_path, image["publicId"], cloud_name, api_key, api_secret)
        image["url"] = secure_url
        print(f"uploaded {image['publicId']}")

    output = Path(args.output) if args.output else manifest_path.with_name("aurabites-catalog-cloudinary.json")
    output.write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    print(json.dumps({"cloudinaryManifest": str(output)}, indent=2))


if __name__ == "__main__":
    main()
