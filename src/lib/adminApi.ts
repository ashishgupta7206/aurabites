import Cookies from "js-cookie";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

export type ApiPagination = {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  errors?: Record<string, unknown>;
  pagination?: ApiPagination;
};

export type AdminOrder = {
  id: number;
  orderDate: string;
  status: string;
  paymentStatus: string;
  paymentMethod?: string;
  totalAmount: number;
  discountAmount: number;
  deliveryCharge: number;
  payableAmount: number;
  customerName?: string;
  customerEmail?: string;
  customerMobile?: string;
  city?: string;
  state?: string;
  pincode?: string;
  addressSummary?: string;
  guestOrder?: boolean;
  itemCount?: number;
  items?: Array<{
    id: number;
    variantId: number;
    productName: string;
    productVariantName: string;
    quantity: number;
    priceAtTime: number;
    variantImage?: string;
    personalizationName?: string;
  }>;
  freeGiftClaimed?: boolean;
  freeGiftType?: string;
  freeGiftName?: string;
  freeGiftSource?: string;
};

export type ProductRow = {
  productId: number;
  productName: string;
  productVariantId: number;
  productVariantName: string;
  productVariantSku: string;
  categoryName?: string;
  status?: string;
  price: number;
  mrp: number;
  stockQty: number;
  productType?: string;
  images?: Array<{ imageUrl: string; sortOrder?: number }>;
};

export type CategoryRow = {
  id: number;
  name: string;
  slug?: string;
  description?: string;
  imageUrl?: string;
  parentId?: number;
  status?: string;
};

export type CouponRow = {
  id: number;
  code: string;
  description?: string;
  discountType: string;
  discountValue: number;
  minOrderValue?: number;
  maxDiscount?: number;
  validFrom?: string;
  validTo?: string;
  usageLimit?: number;
  perUserLimit?: number;
  activeFlag?: boolean;
};

export type FreeGiftCode = {
  id: number;
  code: string;
  claimUrl: string;
  giftType: string;
  status: string;
  batchName?: string;
  marketplace?: string;
  marketplaceOrderRef?: string;
  expiresAt?: string;
  claimedAt?: string;
  freeGiftName?: string;
  customerName?: string;
  customerEmail?: string;
  customerMobile?: string;
  city?: string;
  state?: string;
  pincode?: string;
};

export type WhatsappLog = {
  id: number;
  orderId?: number;
  freeGiftClaimCodeId?: number;
  templateType: string;
  templateName: string;
  recipientMobile?: string;
  providerMessageId?: string;
  status: string;
  errorMessage?: string;
  retryCount?: number;
  sentAt?: string;
  lastStatusAt?: string;
  createdDate?: string;
};

export async function adminRequest<T>(path: string, options: RequestInit = {}) {
  const token = Cookies.get("token");
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const payload = (await response.json().catch(() => null)) as ApiResponse<T> | null;
  if (!response.ok || !payload?.success) {
    throw new Error(payload?.message || `Request failed with ${response.status}`);
  }
  return payload;
}

export const adminApi = {
  dashboardSummary: () => adminRequest<Record<string, unknown>>("/admin/dashboard/summary"),
  lowStock: () => adminRequest<Array<Record<string, unknown>>>("/admin/dashboard/low-stock"),
  whatsappFailures: () => adminRequest<WhatsappLog[]>("/admin/dashboard/whatsapp-failures"),
  searchOrders: (body: Record<string, unknown>) =>
    adminRequest<AdminOrder[]>("/admin/orders/search", { method: "POST", body: JSON.stringify(body) }),
  getOrder: (id: number) => adminRequest<AdminOrder>(`/admin/orders/${id}`),
  updateOrderStatus: (id: number, status: string, remark?: string) =>
    adminRequest<AdminOrder>(`/admin/orders/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status, remark }),
    }),
  searchProducts: (body: Record<string, unknown>) =>
    adminRequest<ProductRow[]>("/products/search", { method: "POST", body: JSON.stringify(body) }),
  createProduct: (body: Record<string, unknown>) =>
    adminRequest<unknown>("/products", { method: "POST", body: JSON.stringify(body) }),
  updateProduct: (id: number, body: Record<string, unknown>) =>
    adminRequest<unknown>(`/products/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteProduct: (id: number) => adminRequest<unknown>(`/products/${id}`, { method: "DELETE" }),
  searchCategories: () =>
    adminRequest<CategoryRow[]>("/categories/search", {
      method: "POST",
      body: JSON.stringify({ pagination: { page: 0, size: 200 } }),
    }),
  createCategory: (body: Record<string, unknown>) =>
    adminRequest<unknown>("/categories", { method: "POST", body: JSON.stringify(body) }),
  updateCategory: (id: number, body: Record<string, unknown>) =>
    adminRequest<unknown>(`/categories/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteCategory: (id: number) => adminRequest<unknown>(`/categories/${id}`, { method: "DELETE" }),
  listCoupons: () => adminRequest<CouponRow[]>("/coupons"),
  createCoupon: (body: Record<string, unknown>) =>
    adminRequest<unknown>("/coupons", { method: "POST", body: JSON.stringify(body) }),
  updateCoupon: (id: number, body: Record<string, unknown>) =>
    adminRequest<unknown>(`/coupons/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteCoupon: (id: number) => adminRequest<unknown>(`/coupons/${id}`, { method: "DELETE" }),
  addStock: (variantId: number, qty: number, remarks: string) =>
    adminRequest<unknown>(
      `/inventory/${variantId}/add?qty=${encodeURIComponent(qty)}&remarks=${encodeURIComponent(remarks)}`,
      { method: "POST" },
    ),
  reduceStock: (variantId: number, qty: number, remarks: string) =>
    adminRequest<unknown>(
      `/inventory/${variantId}/reduce?qty=${encodeURIComponent(qty)}&remarks=${encodeURIComponent(remarks)}`,
      { method: "POST" },
    ),
  listGiftCodes: (query = "") => adminRequest<FreeGiftCode[]>(`/admin/free-gifts/codes${query}`),
  generateGiftCodes: (body: Record<string, unknown>) =>
    adminRequest<FreeGiftCode[]>("/admin/free-gifts/codes", { method: "POST", body: JSON.stringify(body) }),
  whatsappHealth: () => adminRequest<Record<string, unknown>>("/admin/whatsapp/health"),
  whatsappLogs: (status?: string) =>
    adminRequest<WhatsappLog[]>(`/admin/whatsapp/logs?page=0&size=50${status ? `&status=${status}` : ""}`),
  retryWhatsapp: (id: number) => adminRequest<WhatsappLog>(`/admin/whatsapp/logs/${id}/retry`, { method: "POST" }),
  sendWhatsapp: (orderId: number, templateType: string) =>
    adminRequest<WhatsappLog>(`/admin/whatsapp/orders/${orderId}/${templateType}`, { method: "POST" }),
};
