import fs from 'node:fs/promises';

const API_BASE = process.env.AURABITES_API_BASE_URL || 'http://localhost:8000/api';
const ADMIN_EMAIL = process.env.AURABITES_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.AURABITES_ADMIN_PASSWORD;
const MANIFEST_PATH = process.env.AURABITES_CATALOG_MANIFEST;

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  throw new Error('Set AURABITES_ADMIN_EMAIL and AURABITES_ADMIN_PASSWORD.');
}

if (!MANIFEST_PATH) {
  throw new Error('Set AURABITES_CATALOG_MANIFEST to aurabites-catalog-cloudinary.json.');
}

const manifest = JSON.parse(await fs.readFile(MANIFEST_PATH, 'utf8'));

async function api(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;
  if (!response.ok || payload?.success === false) {
    throw new Error(`${options.method || 'GET'} ${path} failed: ${payload?.message || response.statusText}`);
  }
  return payload;
}

async function login() {
  const payload = await api('/auth/login', {
    method: 'POST',
    body: {
      identifier: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    },
  });
  return payload.data.accessToken;
}

async function findCategory() {
  const payload = await api('/categories/search/parent', {
    method: 'POST',
    body: {
      pagination: { page: 0, size: 100 },
      sorting: [{ orderBy: 'name', order: 'asc' }],
    },
  });
  return (payload.data || []).find((category) => category.slug === 'roasted-makhana' || category.name === manifest.category.name);
}

async function ensureCategory(token) {
  const existing = await findCategory();
  const body = {
    name: manifest.category.name,
    description: manifest.category.description,
    imageUrl: manifest.categoryImage.url,
    status: manifest.category.status,
  };

  if (existing) {
    await api(`/categories/${existing.id}`, {
      method: 'PUT',
      token,
      body,
    });
    return existing.id;
  }

  const created = await api('/categories', {
    method: 'POST',
    token,
    body,
  });
  return created.data.id;
}

async function allProducts() {
  const payload = await api('/products/search', {
    method: 'POST',
    body: {
      pagination: { page: 0, size: 500 },
      sorting: [{ orderBy: 'id', order: 'asc' }],
    },
  });
  return payload.data || [];
}

async function productDetail(productId) {
  const payload = await api(`/products/${productId}`, { method: 'GET' });
  return payload.data;
}

function variantPayload(product, categoryId, existingVariant = null, existingImages = []) {
  const images = product.images.map((image) => {
    const existing = existingImages.find((candidate) => Number(candidate.sortOrder) === Number(image.sortOrder));
    return {
      id: existing?.id,
      imageUrl: image.url,
      sortOrder: image.sortOrder,
      deleteFlag: false,
    };
  });

  return {
    id: existingVariant?.id,
    name: product.flavourName,
    sku: product.sku,
    price: manifest.pricing.price,
    mrp: manifest.pricing.mrp,
    discountPercent: manifest.pricing.discountPercent,
    stockQty: Number(process.env.AURABITES_INITIAL_STOCK || 100),
    size: process.env.AURABITES_JAR_SIZE || '70g',
    weight: process.env.AURABITES_JAR_WEIGHT || '0.18',
    length: process.env.AURABITES_JAR_LENGTH || '8',
    breadth: process.env.AURABITES_JAR_BREADTH || '8',
    height: process.env.AURABITES_JAR_HEIGHT || '16',
    color: product.accent,
    isActive: true,
    categorySortOrder: product.sortOrder,
    rating: '4.8',
    storageInstructions:
      'Store in a cool, dry place. Once opened, store in an airtight container to retain crunchiness.',
    productVariantMktStatus: product.mktStatus,
    productVariantMktStatusSortOrder: product.sortOrder,
    sortOrder: product.sortOrder,
    productType: 'JAR',
    images,
  };
}

function createPayload(product, categoryId) {
  return {
    name: product.name,
    shortDescription: product.description,
    longDescription: product.longDescription,
    mainImage: product.images[0].url,
    categoryId,
    status: 'ACTIVE',
    variants: [variantPayload(product, categoryId)],
    images: product.images.map((image) => ({
      imageUrl: image.url,
      sortOrder: image.sortOrder,
    })),
  };
}

async function upsertProducts(token, categoryId) {
  const existingRows = await allProducts();
  const bySku = new Map(existingRows.map((row) => [row.productVariantSku, row]));

  for (const product of manifest.products) {
    const existing = bySku.get(product.sku);
    if (!existing) {
      const created = await api('/products', {
        method: 'POST',
        token,
        body: createPayload(product, categoryId),
      });
      console.log(`created ${product.sku} productId=${created.data.id}`);
      continue;
    }

    const detail = await productDetail(existing.productId);
    const variant = (detail.variants || []).find((candidate) => candidate.sku === product.sku) || detail.variants?.[0];
    const images = variant?.images || [];
    await api(`/products/${existing.productId}`, {
      method: 'PUT',
      token,
      body: {
        name: product.name,
        shortDescription: product.description,
        longDescription: product.longDescription,
        mainImage: product.images[0].url,
        categoryId,
        status: 'ACTIVE',
        variants: [variantPayload(product, categoryId, variant, images)],
      },
    });
    console.log(`updated ${product.sku} productId=${existing.productId}`);
  }
}

const token = await login();
const categoryId = await ensureCategory(token);
await upsertProducts(token, categoryId);
console.log(JSON.stringify({ seeded: true, categoryId, productCount: manifest.products.length }, null, 2));
