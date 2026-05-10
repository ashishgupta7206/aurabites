import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { lazy, Suspense } from "react";

const Index = lazy(() => import("./pages/Index"));
const ShopPage = lazy(() => import("./pages/ShopPage"));
const CategoriesPage = lazy(() => import("./pages/CategoriesPage"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const ProductDetailPage = lazy(() => import("./pages/ProductDetailPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const ClaimKeyringPage = lazy(() => import("./pages/ClaimKeyringPage"));
const OrderSuccessPage = lazy(() => import("./pages/OrderSuccessPage"));
const OrderFailedPage = lazy(() => import("./pages/OrderFailedPage"));
const OrderHistoryPage = lazy(() => import("./pages/OrderHistoryPage"));
const OrderDetailsPage = lazy(() => import("./pages/OrderDetailsPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));
const PrivacyPolicyPage = lazy(() => import("./pages/PrivacyPolicyPage"));
const RefundPolicyPage = lazy(() => import("./pages/RefundPolicyPage"));
const ShippingPolicyPage = lazy(() => import("./pages/ShippingPolicyPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Suspense fallback={<div className="min-h-screen bg-background" />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/shop" element={<ShopPage />} />
                  <Route path="/categories" element={<CategoriesPage />} />
                  <Route path="/category/:id" element={<CategoryPage />} />
                  <Route path="/product/:id" element={<ProductDetailPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/claim-keyring" element={<ClaimKeyringPage />} />
                  <Route path="/order-success" element={<OrderSuccessPage />} />
                  <Route path="/order-failed" element={<OrderFailedPage />} />
                  <Route path="/orders" element={<OrderHistoryPage />} />
                  <Route path="/orders/:id" element={<OrderDetailsPage />} />
                  <Route path="/terms" element={<TermsPage />} />
                  <Route path="/privacy" element={<PrivacyPolicyPage />} />
                  <Route path="/refund" element={<RefundPolicyPage />} />
                  <Route path="/shipping" element={<ShippingPolicyPage />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
