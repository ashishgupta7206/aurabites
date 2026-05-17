import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Link, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  BadgeIndianRupee,
  Boxes,
  ClipboardList,
  Gift,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageCircle,
  Package,
  Percent,
  RefreshCw,
  Search,
  ShieldCheck,
  Tags,
  Truck,
} from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/contexts/AuthContext";
import {
  AdminOrder,
  CategoryRow,
  CouponRow,
  FreeGiftCode,
  ProductRow,
  WhatsappLog,
  adminApi,
} from "@/lib/adminApi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const orderStatuses = ["PLACED", "CONFIRMED", "PAID", "PACKED", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED"];
const paymentStatuses = ["PENDING", "SUCCESS", "FAILED", "REFUNDED"];
const whatsappTemplates = ["ORDER_PLACED", "PAYMENT_CONFIRMED", "ORDER_SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"];

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/orders", label: "Orders", icon: ClipboardList },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/categories", label: "Categories", icon: Tags },
  { to: "/admin/inventory", label: "Inventory", icon: Boxes },
  { to: "/admin/coupons", label: "Coupons", icon: Percent },
  { to: "/admin/free-gifts", label: "Free Gifts", icon: Gift },
  { to: "/admin/whatsapp", label: "WhatsApp", icon: MessageCircle },
];

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const date = (value?: string) => (value ? new Date(value).toLocaleString("en-IN") : "-");
const money = (value?: number) => currency.format(Number(value || 0));
const isAdminRole = (role?: string) => Boolean(role && role.toUpperCase().includes("ADMIN"));

export default function AdminConsole() {
  const { user, isLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  if (isLoading) {
    return <AdminLoading />;
  }

  if (!user) {
    return <Navigate to="/login?redirect=/admin" replace />;
  }

  if (!isAdminRole(user.role)) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Helmet>
        <title>Admin Console - AuraBites</title>
      </Helmet>
      <div className="min-h-screen bg-[#f7f1e8] text-[#24160f]">
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-[#e6d8c5] bg-[#120d0a] p-5 text-white lg:block">
          <AdminSidebar onNavigate={() => undefined} />
        </aside>

        <div className="lg:pl-72">
          <header className="sticky top-0 z-20 border-b border-[#e6d8c5] bg-[#fff8eb]/90 px-4 py-3 backdrop-blur md:px-8">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="lg:hidden">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80 border-none bg-[#120d0a] text-white">
                    <SheetHeader>
                      <SheetTitle className="text-left text-white">AuraBites Admin</SheetTitle>
                    </SheetHeader>
                    <AdminSidebar onNavigate={() => setMobileNavOpen(false)} />
                  </SheetContent>
                </Sheet>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#9b4a1c]">Ops Console</p>
                  <h1 className="font-display text-xl font-extrabold md:text-2xl">AuraBites Admin</h1>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button asChild variant="outline" className="hidden md:inline-flex">
                  <Link to="/">
                    <Home className="h-4 w-4" />
                    Storefront
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    logout();
                    navigate("/login?redirect=/admin");
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          </header>

          <main className="px-4 py-6 md:px-8">
            <Routes>
              <Route index element={<DashboardPage />} />
              <Route path="orders" element={<OrdersPage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="categories" element={<CategoriesPage />} />
              <Route path="inventory" element={<InventoryPage />} />
              <Route path="coupons" element={<CouponsPage />} />
              <Route path="free-gifts" element={<FreeGiftsPage />} />
              <Route path="whatsapp" element={<WhatsappPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </>
  );
}

function AdminSidebar({ onNavigate }: { onNavigate: () => void }) {
  const location = useLocation();

  return (
    <div className="mt-6 flex h-[calc(100%-1.5rem)] flex-col">
      <Link to="/admin" onClick={onNavigate} className="mb-8 flex items-center gap-3">
        <img src="/aurabites-logo-transparent.png" alt="AuraBites" className="h-10 w-20 rounded bg-white object-contain p-2" />
        <div>
          <p className="text-sm font-extrabold">AuraBites</p>
          <p className="text-xs text-white/55">Admin console</p>
        </div>
      </Link>

      <nav className="space-y-1">
        {navItems.map((item) => {
          const active = location.pathname === item.to || (item.to !== "/admin" && location.pathname.startsWith(item.to));
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                active ? "bg-[#f6b26b] text-[#20120a]" : "text-white/72 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-white/70">
        <ShieldCheck className="mb-2 h-5 w-5 text-[#f6b26b]" />
        Admin API requests use the same JWT token and backend role checks.
      </div>
    </div>
  );
}

function DashboardPage() {
  const [summary, setSummary] = useState<Record<string, unknown>>({});
  const [lowStock, setLowStock] = useState<Array<Record<string, unknown>>>([]);
  const [failures, setFailures] = useState<WhatsappLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([adminApi.dashboardSummary(), adminApi.lowStock(), adminApi.whatsappFailures()])
      .then(([summaryRes, stockRes, failuresRes]) => {
        setSummary(summaryRes.data || {});
        setLowStock(stockRes.data || []);
        setFailures(failuresRes.data || []);
      })
      .catch((error) => toast.error(error.message))
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: "Total Orders", value: summary.totalOrders, icon: ClipboardList },
    { label: "Orders Today", value: summary.ordersToday, icon: Package },
    { label: "Paid Revenue", value: money(Number(summary.totalPaidRevenue || 0)), icon: BadgeIndianRupee },
    { label: "Gift Claims", value: summary.claimedGiftCodes, icon: Gift },
    { label: "Low Stock", value: summary.lowStockCount, icon: Boxes },
    { label: "WhatsApp Failures", value: summary.failedWhatsappMessages, icon: MessageCircle },
  ];

  return (
    <AdminPage title="Dashboard" description="The daily control room for orders, stock, gifts, and customer messages.">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {statCards.map((stat) => (
          <StatCard key={stat.label} {...stat} loading={loading} />
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <AdminCard title="Low Stock Watch" description="Variants at or below the default alert threshold.">
          <SimpleRows
            rows={lowStock.slice(0, 8)}
            empty="No low-stock variants."
            render={(row) => (
              <>
                <div>
                  <p className="font-semibold">{String(row.productName || "-")}</p>
                  <p className="text-xs text-muted-foreground">{String(row.sku || row.variantName || "-")}</p>
                </div>
                <Badge variant="outline">{String(row.stockQty ?? 0)} left</Badge>
              </>
            )}
          />
        </AdminCard>

        <AdminCard title="WhatsApp Failures" description="Messages that need retry or template/config review.">
          <SimpleRows
            rows={failures.slice(0, 8)}
            empty="No failed WhatsApp messages."
            render={(row) => (
              <>
                <div>
                  <p className="font-semibold">{row.templateType}</p>
                  <p className="text-xs text-muted-foreground">{row.errorMessage || row.recipientMobile || "-"}</p>
                </div>
                <Badge variant="destructive">{row.status}</Badge>
              </>
            )}
          />
        </AdminCard>
      </div>
    </AdminPage>
  );
}

function OrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [selected, setSelected] = useState<AdminOrder | null>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("ALL");
  const [paymentStatus, setPaymentStatus] = useState("ALL");
  const [nextStatus, setNextStatus] = useState("SHIPPED");
  const [remark, setRemark] = useState("");
  const [loading, setLoading] = useState(false);

  const loadOrders = useCallback(() => {
    setLoading(true);
    adminApi
      .searchOrders({
        query: query || undefined,
        status: status === "ALL" ? undefined : status,
        paymentStatus: paymentStatus === "ALL" ? undefined : paymentStatus,
        pagination: { page: 0, size: 40 },
      })
      .then((response) => setOrders(response.data || []))
      .catch((error) => toast.error(error.message))
      .finally(() => setLoading(false));
  }, [paymentStatus, query, status]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const openOrder = (id: number) => {
    adminApi
      .getOrder(id)
      .then((response) => setSelected(response.data))
      .catch((error) => toast.error(error.message));
  };

  const updateStatus = () => {
    if (!selected) return;
    adminApi
      .updateOrderStatus(selected.id, nextStatus, remark)
      .then((response) => {
        setSelected(response.data);
        toast.success("Order status updated");
        loadOrders();
      })
      .catch((error) => toast.error(error.message));
  };

  return (
    <AdminPage title="Orders" description="Search, inspect, and move orders through fulfillment.">
      <AdminToolbar>
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search customer, mobile, email" />
        <FilterSelect value={status} onValueChange={setStatus} values={["ALL", ...orderStatuses]} />
        <FilterSelect value={paymentStatus} onValueChange={setPaymentStatus} values={["ALL", ...paymentStatuses]} />
        <Button onClick={loadOrders}>
          <Search className="h-4 w-4" />
          Search
        </Button>
      </AdminToolbar>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <AdminCard title="Recent Orders" description={loading ? "Loading orders..." : `${orders.length} loaded`}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <p className="font-semibold">#{order.id}</p>
                    <p className="text-xs text-muted-foreground">{date(order.orderDate)}</p>
                  </TableCell>
                  <TableCell>
                    <p>{order.customerName || "Guest"}</p>
                    <p className="text-xs text-muted-foreground">{order.customerMobile || order.customerEmail}</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      <Badge>{order.status}</Badge>
                      <Badge variant="outline">{order.paymentStatus}</Badge>
                    </div>
                  </TableCell>
                  <TableCell>{money(order.payableAmount)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => openOrder(order.id)}>
                      Open
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </AdminCard>

        <AdminCard title={selected ? `Order #${selected.id}` : "Order Detail"} description="Update status or resend transaction messages.">
          {!selected ? (
            <p className="text-sm text-muted-foreground">Select an order to inspect address, items, gift, and message actions.</p>
          ) : (
            <div className="space-y-5">
              <div className="rounded-lg bg-[#fff8eb] p-4">
                <p className="font-semibold">{selected.customerName}</p>
                <p className="text-sm text-muted-foreground">{selected.addressSummary}</p>
                <p className="mt-2 text-sm">{selected.customerMobile} {selected.customerEmail ? `- ${selected.customerEmail}` : ""}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <Info label="Status" value={selected.status} />
                <Info label="Payment" value={selected.paymentStatus} />
                <Info label="Items" value={String(selected.itemCount || 0)} />
                <Info label="Payable" value={money(selected.payableAmount)} />
              </div>

              {selected.freeGiftClaimed && (
                <div className="rounded-lg border border-[#e6d8c5] p-3 text-sm">
                  <p className="font-semibold">Free Gift</p>
                  <p>{selected.freeGiftType} - {selected.freeGiftName}</p>
                </div>
              )}

              <div className="space-y-2">
                {(selected.items || []).map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-lg border border-[#eadcc8] p-3 text-sm">
                    <div>
                      <p className="font-semibold">{item.productName}</p>
                      <p className="text-muted-foreground">{item.productVariantName} x {item.quantity}</p>
                    </div>
                    <p>{money(item.priceAtTime)}</p>
                  </div>
                ))}
              </div>

              <div className="grid gap-3">
                <Label>Update order status</Label>
                <FilterSelect value={nextStatus} onValueChange={setNextStatus} values={orderStatuses} />
                <Input value={remark} onChange={(e) => setRemark(e.target.value)} placeholder="Remark for status history" />
                <Button onClick={updateStatus}>
                  <Truck className="h-4 w-4" />
                  Update Status
                </Button>
              </div>

              <div className="grid gap-2">
                <Label>Resend WhatsApp</Label>
                <div className="grid grid-cols-2 gap-2">
                  {whatsappTemplates.map((template) => (
                    <Button
                      key={template}
                      variant="outline"
                      size="sm"
                      onClick={() => adminApi.sendWhatsapp(selected.id, template).then(() => toast.success("WhatsApp send attempted")).catch((error) => toast.error(error.message))}
                    >
                      {template.replaceAll("_", " ")}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </AdminCard>
      </div>
    </AdminPage>
  );
}

function ProductsPage() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    name: "",
    categoryId: "",
    shortDescription: "",
    mainImage: "",
    variantName: "",
    sku: "",
    price: "199",
    mrp: "299",
    stockQty: "100",
    productType: "JAR",
  });

  const loadProducts = useCallback(() =>
    adminApi
      .searchProducts({ productName: search || undefined, pagination: { page: 0, size: 80 } })
      .then((response) => setProducts(response.data || []))
      .catch((error) => toast.error(error.message)), [search]);

  useEffect(() => {
    loadProducts();
    adminApi.searchCategories().then((response) => setCategories(response.data || [])).catch(() => undefined);
  }, [loadProducts]);

  const createProduct = (event: FormEvent) => {
    event.preventDefault();
    adminApi
      .createProduct({
        name: form.name,
        categoryId: Number(form.categoryId),
        shortDescription: form.shortDescription,
        mainImage: form.mainImage,
        status: "ACTIVE",
        variants: [
          {
            name: form.variantName || form.name,
            sku: form.sku,
            price: Number(form.price),
            mrp: Number(form.mrp),
            stockQty: Number(form.stockQty),
            isActive: true,
            productType: form.productType,
            images: form.mainImage ? [{ imageUrl: form.mainImage, sortOrder: 0 }] : [],
          },
        ],
        images: form.mainImage ? [{ imageUrl: form.mainImage, sortOrder: 0 }] : [],
      })
      .then(() => {
        toast.success("Product created");
        loadProducts();
      })
      .catch((error) => toast.error(error.message));
  };

  return (
    <AdminPage title="Products" description="Create products and review backend-matched catalog rows.">
      <div className="grid gap-6 xl:grid-cols-[400px_minmax(0,1fr)]">
        <AdminCard title="Create Product" description="Use this for quick single-variant listings.">
          <form onSubmit={createProduct} className="grid gap-3">
            <Field label="Product name" value={form.name} onChange={(value) => setForm({ ...form, name: value })} />
            <Label>Category</Label>
            <FilterSelect
              value={form.categoryId || "none"}
              onValueChange={(value) => setForm({ ...form, categoryId: value === "none" ? "" : value })}
              values={["none", ...categories.map((category) => String(category.id))]}
              labels={{ none: "Select category", ...Object.fromEntries(categories.map((category) => [String(category.id), category.name])) }}
            />
            <Field label="Short description" value={form.shortDescription} onChange={(value) => setForm({ ...form, shortDescription: value })} />
            <Field label="Main image URL" value={form.mainImage} onChange={(value) => setForm({ ...form, mainImage: value })} />
            <Field label="Variant name" value={form.variantName} onChange={(value) => setForm({ ...form, variantName: value })} />
            <Field label="SKU" value={form.sku} onChange={(value) => setForm({ ...form, sku: value })} />
            <div className="grid grid-cols-3 gap-2">
              <Field label="Price" value={form.price} onChange={(value) => setForm({ ...form, price: value })} />
              <Field label="MRP" value={form.mrp} onChange={(value) => setForm({ ...form, mrp: value })} />
              <Field label="Stock" value={form.stockQty} onChange={(value) => setForm({ ...form, stockQty: value })} />
            </div>
            <Button type="submit">Create Product</Button>
          </form>
        </AdminCard>

        <AdminCard title="Product Rows" description="Search products and variants currently returned by backend.">
          <AdminToolbar>
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products" />
            <Button onClick={loadProducts}>
              <Search className="h-4 w-4" />
              Search
            </Button>
          </AdminToolbar>
          <ProductTable products={products} onRefresh={loadProducts} />
        </AdminCard>
      </div>
    </AdminPage>
  );
}

function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [form, setForm] = useState({ name: "", description: "", imageUrl: "", status: "ACTIVE" });

  const load = () => adminApi.searchCategories().then((response) => setCategories(response.data || [])).catch((error) => toast.error(error.message));
  useEffect(load, []);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    adminApi.createCategory(form).then(() => {
      toast.success("Category created");
      setForm({ name: "", description: "", imageUrl: "", status: "ACTIVE" });
      load();
    }).catch((error) => toast.error(error.message));
  };

  return (
    <AdminPage title="Categories" description="Maintain shop category structure.">
      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <AdminCard title="New Category">
          <form onSubmit={submit} className="grid gap-3">
            <Field label="Name" value={form.name} onChange={(value) => setForm({ ...form, name: value })} />
            <Field label="Image URL" value={form.imageUrl} onChange={(value) => setForm({ ...form, imageUrl: value })} />
            <Label>Description</Label>
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <Button type="submit">Create Category</Button>
          </form>
        </AdminCard>
        <AdminCard title="Categories">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <p className="font-semibold">{category.name}</p>
                    <p className="text-xs text-muted-foreground">{category.slug}</p>
                  </TableCell>
                  <TableCell><Badge>{category.status || "ACTIVE"}</Badge></TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => adminApi.deleteCategory(category.id).then(load).catch((error) => toast.error(error.message))}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </AdminCard>
      </div>
    </AdminPage>
  );
}

function InventoryPage() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [qty, setQty] = useState("10");
  const [remarks, setRemarks] = useState("Admin stock adjustment");

  const load = () => adminApi.searchProducts({ pagination: { page: 0, size: 120 } }).then((response) => setProducts(response.data || [])).catch((error) => toast.error(error.message));
  useEffect(load, []);

  const adjust = (variantId: number, mode: "add" | "reduce") => {
    const amount = Number(qty || 0);
    const action = mode === "add" ? adminApi.addStock : adminApi.reduceStock;
    action(variantId, amount, remarks).then(() => {
      toast.success("Stock updated");
      load();
    }).catch((error) => toast.error(error.message));
  };

  return (
    <AdminPage title="Inventory" description="Fast stock corrections by product variant.">
      <AdminToolbar>
        <Input className="max-w-28" value={qty} onChange={(e) => setQty(e.target.value)} placeholder="Qty" />
        <Input value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="Remarks" />
        <Button variant="outline" onClick={load}>
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </AdminToolbar>
      <AdminCard title="Variant Stock">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.productVariantId}>
                <TableCell>{product.productName} <span className="text-muted-foreground">/ {product.productVariantName}</span></TableCell>
                <TableCell>{product.productVariantSku}</TableCell>
                <TableCell><Badge variant="outline">{product.stockQty ?? 0}</Badge></TableCell>
                <TableCell className="space-x-2 text-right">
                  <Button size="sm" variant="outline" onClick={() => adjust(product.productVariantId, "add")}>Add</Button>
                  <Button size="sm" variant="outline" onClick={() => adjust(product.productVariantId, "reduce")}>Reduce</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </AdminCard>
    </AdminPage>
  );
}

function CouponsPage() {
  const [coupons, setCoupons] = useState<CouponRow[]>([]);
  const [form, setForm] = useState({
    code: "",
    description: "",
    discountType: "FLAT",
    discountValue: "50",
    minOrderValue: "0",
    maxDiscount: "",
    validFrom: "",
    validTo: "",
    usageLimit: "",
    perUserLimit: "1",
    activeFlag: true,
  });

  const load = () => adminApi.listCoupons().then((response) => setCoupons(response.data || [])).catch((error) => toast.error(error.message));
  useEffect(load, []);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    adminApi.createCoupon({
      ...form,
      discountValue: Number(form.discountValue),
      minOrderValue: Number(form.minOrderValue || 0),
      maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : null,
      usageLimit: form.usageLimit ? Number(form.usageLimit) : null,
      perUserLimit: form.perUserLimit ? Number(form.perUserLimit) : null,
      validFrom: form.validFrom || null,
      validTo: form.validTo || null,
    }).then(() => {
      toast.success("Coupon created");
      load();
    }).catch((error) => toast.error(error.message));
  };

  return (
    <AdminPage title="Coupons" description="Create and retire promotion codes.">
      <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
        <AdminCard title="New Coupon">
          <form onSubmit={submit} className="grid gap-3">
            <Field label="Code" value={form.code} onChange={(value) => setForm({ ...form, code: value.toUpperCase() })} />
            <Field label="Description" value={form.description} onChange={(value) => setForm({ ...form, description: value })} />
            <FilterSelect value={form.discountType} onValueChange={(value) => setForm({ ...form, discountType: value })} values={["FLAT", "PERCENTAGE"]} />
            <div className="grid grid-cols-2 gap-2">
              <Field label="Discount" value={form.discountValue} onChange={(value) => setForm({ ...form, discountValue: value })} />
              <Field label="Min order" value={form.minOrderValue} onChange={(value) => setForm({ ...form, minOrderValue: value })} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Valid from" type="datetime-local" value={form.validFrom} onChange={(value) => setForm({ ...form, validFrom: value })} />
              <Field label="Valid to" type="datetime-local" value={form.validTo} onChange={(value) => setForm({ ...form, validTo: value })} />
            </div>
            <Button type="submit">Create Coupon</Button>
          </form>
        </AdminCard>
        <AdminCard title="Coupons">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Validity</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {coupons.map((coupon) => (
                <TableRow key={coupon.id}>
                  <TableCell>
                    <p className="font-semibold">{coupon.code}</p>
                    <p className="text-xs text-muted-foreground">{coupon.description}</p>
                  </TableCell>
                  <TableCell>{coupon.discountType} {coupon.discountValue}</TableCell>
                  <TableCell className="text-xs">{date(coupon.validFrom)}<br />{date(coupon.validTo)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => adminApi.deleteCoupon(coupon.id).then(load).catch((error) => toast.error(error.message))}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </AdminCard>
      </div>
    </AdminPage>
  );
}

function FreeGiftsPage() {
  const [codes, setCodes] = useState<FreeGiftCode[]>([]);
  const [status, setStatus] = useState("ALL");
  const [form, setForm] = useState({ quantity: "25", prefix: "AB-MP", batchName: "", marketplace: "" });

  const load = () => {
    const params = new URLSearchParams();
    if (status !== "ALL") params.set("status", status);
    adminApi.listGiftCodes(params.toString() ? `?${params.toString()}` : "").then((response) => setCodes(response.data || [])).catch((error) => toast.error(error.message));
  };
  useEffect(load, [status]);

  const generate = (event: FormEvent) => {
    event.preventDefault();
    adminApi.generateGiftCodes({
      quantity: Number(form.quantity),
      prefix: form.prefix,
      batchName: form.batchName || null,
      marketplace: form.marketplace || null,
      giftType: "NAMED_KEYRING",
    }).then((response) => {
      toast.success(`${response.data.length} codes generated`);
      load();
    }).catch((error) => toast.error(error.message));
  };

  const exportCsv = () => {
    const csv = ["Code,Claim URL,Status,Marketplace,Batch", ...codes.map((code) => [code.code, code.claimUrl, code.status, code.marketplace || "", code.batchName || ""].join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "aurabites-free-gift-codes.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AdminPage title="Free Gifts" description="Generate marketplace claim codes for the named keyring gift flow.">
      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <AdminCard title="Generate Codes">
          <form onSubmit={generate} className="grid gap-3">
            <Field label="Quantity" value={form.quantity} onChange={(value) => setForm({ ...form, quantity: value })} />
            <Field label="Prefix" value={form.prefix} onChange={(value) => setForm({ ...form, prefix: value })} />
            <Field label="Batch name" value={form.batchName} onChange={(value) => setForm({ ...form, batchName: value })} />
            <Field label="Marketplace" value={form.marketplace} onChange={(value) => setForm({ ...form, marketplace: value })} />
            <Button type="submit">Generate Codes</Button>
          </form>
        </AdminCard>
        <AdminCard title="Claim Codes" description={`${codes.length} latest codes`}>
          <AdminToolbar>
            <FilterSelect value={status} onValueChange={setStatus} values={["ALL", "ACTIVE", "CLAIMED", "EXPIRED", "DISABLED"]} />
            <Button variant="outline" onClick={exportCsv}>Export CSV</Button>
          </AdminToolbar>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Claim URL</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {codes.map((code) => (
                <TableRow key={code.id}>
                  <TableCell className="font-semibold">{code.code}</TableCell>
                  <TableCell><Badge>{code.status}</Badge></TableCell>
                  <TableCell>{code.customerName || code.marketplace || "-"}</TableCell>
                  <TableCell className="max-w-64 truncate text-xs">{code.claimUrl}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </AdminCard>
      </div>
    </AdminPage>
  );
}

function WhatsappPage() {
  const [health, setHealth] = useState<Record<string, unknown>>({});
  const [logs, setLogs] = useState<WhatsappLog[]>([]);
  const [status, setStatus] = useState("ALL");
  const [manual, setManual] = useState({ orderId: "", templateType: "ORDER_PLACED" });

  const load = () => {
    adminApi.whatsappHealth().then((response) => setHealth(response.data || {})).catch((error) => toast.error(error.message));
    adminApi.whatsappLogs(status === "ALL" ? undefined : status).then((response) => setLogs(response.data || [])).catch((error) => toast.error(error.message));
  };
  useEffect(load, [status]);

  const sendManual = (event: FormEvent) => {
    event.preventDefault();
    adminApi.sendWhatsapp(Number(manual.orderId), manual.templateType).then(() => {
      toast.success("WhatsApp send attempted");
      load();
    }).catch((error) => toast.error(error.message));
  };

  return (
    <AdminPage title="WhatsApp" description="Transactional notification health, delivery logs, and retries.">
      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <div className="space-y-6">
          <AdminCard title="Configuration Health">
            <div className="grid gap-3 text-sm">
              <Info label="Enabled" value={String(health.enabled ?? false)} />
              <Info label="Phone Number ID" value={String(health.phoneNumberConfigured ?? false)} />
              <Info label="Access Token" value={String(health.accessTokenConfigured ?? false)} />
              <Info label="Graph Version" value={String(health.graphApiVersion ?? "-")} />
              <Info label="Failed Messages" value={String(health.failedMessages ?? 0)} />
            </div>
          </AdminCard>
          <AdminCard title="Manual Send">
            <form onSubmit={sendManual} className="grid gap-3">
              <Field label="Order ID" value={manual.orderId} onChange={(value) => setManual({ ...manual, orderId: value })} />
              <FilterSelect value={manual.templateType} onValueChange={(value) => setManual({ ...manual, templateType: value })} values={whatsappTemplates} />
              <Button type="submit">Send Template</Button>
            </form>
          </AdminCard>
        </div>
        <AdminCard title="Message Logs">
          <AdminToolbar>
            <FilterSelect value={status} onValueChange={setStatus} values={["ALL", "PENDING", "SENT", "DELIVERED", "READ", "FAILED", "SKIPPED"]} />
            <Button variant="outline" onClick={load}>
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </AdminToolbar>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Template</TableHead>
                <TableHead>Recipient</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Error</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <p className="font-semibold">{log.templateType}</p>
                    <p className="text-xs text-muted-foreground">Order #{log.orderId || "-"}</p>
                  </TableCell>
                  <TableCell>{log.recipientMobile || "-"}</TableCell>
                  <TableCell><Badge variant={log.status === "FAILED" ? "destructive" : "outline"}>{log.status}</Badge></TableCell>
                  <TableCell className="max-w-60 truncate text-xs">{log.errorMessage || "-"}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => adminApi.retryWhatsapp(log.id).then(load).catch((error) => toast.error(error.message))}>
                      Retry
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </AdminCard>
      </div>
    </AdminPage>
  );
}

function ProductTable({ products, onRefresh }: { products: ProductRow[]; onRefresh: () => void }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={`${product.productId}-${product.productVariantId}`}>
            <TableCell>
              <p className="font-semibold">{product.productName}</p>
              <p className="text-xs text-muted-foreground">{product.productVariantName} - {product.productVariantSku}</p>
            </TableCell>
            <TableCell>{product.categoryName || "-"}</TableCell>
            <TableCell>{money(product.price)} <span className="text-xs text-muted-foreground line-through">{money(product.mrp)}</span></TableCell>
            <TableCell><Badge variant="outline">{product.stockQty ?? 0}</Badge></TableCell>
            <TableCell className="text-right">
              <Button variant="outline" size="sm" onClick={() => adminApi.deleteProduct(product.productId).then(onRefresh).catch((error) => toast.error(error.message))}>
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function AdminPage({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="mb-6">
        <h2 className="font-display text-3xl font-extrabold tracking-tight">{title}</h2>
        <p className="mt-1 max-w-2xl text-sm text-[#6f5c4d]">{description}</p>
      </div>
      {children}
    </section>
  );
}

function AdminCard({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <Card className="border-[#e6d8c5] bg-[#fffdf7] shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function StatCard({ label, value, icon: Icon, loading }: { label: string; value: unknown; icon: typeof LayoutDashboard; loading: boolean }) {
  return (
    <Card className="border-[#e6d8c5] bg-[#fffdf7]">
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <p className="text-sm text-[#7a6656]">{label}</p>
          <p className="mt-1 text-2xl font-extrabold">{loading ? "-" : String(value ?? 0)}</p>
        </div>
        <div className="rounded-full bg-[#f6b26b]/20 p-3 text-[#9b4a1c]">
          <Icon className="h-6 w-6" />
        </div>
      </CardContent>
    </Card>
  );
}

function AdminToolbar({ children }: { children: React.ReactNode }) {
  return <div className="mb-4 grid gap-2 md:flex md:items-center">{children}</div>;
}

function FilterSelect({
  value,
  onValueChange,
  values,
  labels = {},
}: {
  value: string;
  onValueChange: (value: string) => void;
  values: string[];
  labels?: Record<string, string>;
}) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="min-w-44 bg-white">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {values.map((option) => (
          <SelectItem key={option} value={option}>
            {labels[option] || option.replaceAll("_", " ")}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  const id = useMemo(() => label.toLowerCase().replaceAll(" ", "-"), [label]);
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} value={value} onChange={(event) => onChange(event.target.value)} />
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[#eadcc8] bg-white p-3">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}

function SimpleRows<T>({ rows, empty, render }: { rows: T[]; empty: string; render: (row: T) => React.ReactNode }) {
  if (!rows.length) {
    return <p className="text-sm text-muted-foreground">{empty}</p>;
  }
  return (
    <div className="space-y-2">
      {rows.map((row, index) => (
        <div key={index} className="flex items-center justify-between gap-3 rounded-lg border border-[#eadcc8] bg-white p-3 text-sm">
          {render(row)}
        </div>
      ))}
    </div>
  );
}

function AdminLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f1e8]">
      <div className="text-center">
        <RefreshCw className="mx-auto mb-3 h-7 w-7 animate-spin text-[#9b4a1c]" />
        <p className="font-semibold">Loading admin console</p>
      </div>
    </div>
  );
}
