import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CartBar } from '@/components/CartBar';
import { CartDrawer } from '@/components/CartDrawer';
import { ProductCard } from '@/components/ProductCard';
import { useToast } from '@/components/ui/use-toast';

// Interfaces based on User's API Response
interface ShopProduct {
  productId: number;
  productName: string;
  productSlug: string;
  shortDescription: string;
  longDescription: string;
  mainImage: string;
  status: string;
  categoryId: number;
  categoryName: string;
  productVariantId: number;
  productVariantName: string;
  productVariantSku: string;
  price: number;
  mrp: number;
  discountPercent: number;
  stockQty: number;
  size: string;
  weight: string | null;
  color: string | null;
  barcode: string | null;
  productVariantIsActive: boolean;
  categorySortOrder: number | null;
  productVariantRating: string;
  productVariantMktStatus: string;
  productVariantMktStatusSortOrder: number | null;
  sortOrder: number | null;
  productType: string;
  listOfVariantInCombo: any[];
  images: { id: number; imageUrl: string; sortOrder: number }[];
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: ShopProduct[];
  pagination: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
}

const ShopPage = () => {
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [shopProducts, setShopProducts] = useState<ShopProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

  const tabs = [
    { id: 'ALL', label: 'ALL PRODUCTS' },
    { id: 'POUCH', label: 'POUCH' },
    { id: 'JAR', label: 'JAR' },
    { id: 'COMBO', label: 'COMBO' },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Determine productType for API
        // Assuming the API expects null for "ALL" or just omits it.
        // Based on user request struct: "productType": "JAR" or "productType": null for all?
        // The user's example showed "productType": "JAR". For ALL, sending null is a safe bet usually.
        const productType = selectedType === 'ALL' ? null : selectedType;

        const response = await fetch(`${API_BASE_URL}/products/search`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productType: productType,
            pagination: {
              page: 0,
              size: 100 // increased size to show more products
            },
            sorting: [
              {
                orderBy: "id",
                order: "desc"
              },
              {
                orderBy: "name",
                order: "asc"
              }
            ]
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const data: ApiResponse = await response.json();
        if (data.success) {
          setShopProducts(data.data);
        } else {
          toast({
            title: "Error",
            description: data.message || "Failed to load products",
            variant: "destructive"
          });
        }

      } catch (error) {
        console.error("Error fetching shop products:", error);
        toast({
          title: "Error",
          description: "Something went wrong while loading products.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedType, API_BASE_URL, toast]);

  // Map ShopProduct to the format expected by ProductCard
  // ProductCard expects: { id, name, price, originalPrice, image, flavor, flavorColor, ... }
  const mapToProductCardProps = (sp: ShopProduct) => {

    return {
      id: String(sp.productVariantId), // Use Variant ID for consistency with cart logic
      productId: sp.productId,
      name: sp.productVariantName, // Use Variant Name
      price: sp.price,
      originalPrice: sp.mrp,
      image: sp.images[0]?.imageUrl,
      flavor: sp.productName,
      flavorColor: sp.color || "#FFF",
      categoryId: String(sp.categoryId),
      description: sp.shortDescription,
      isBestseller: sp.productVariantMktStatus === 'BEST_SELLER',
      isNew: sp.productVariantMktStatus === 'NEW_LAUNCH',
      protein: '10g',
    };
  };

  return (
    <>
      <Helmet>
        <title>Shop All Makhana Snacks – Aurabites</title>
        <meta name="description" content="Shop premium roasted makhana snacks from Aurabites. Multiple flavors, 10g protein per pack. Free delivery across India." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="pt-24 pb-32 md:pb-16">
          {/* Header */}
          <section className="gradient-cream py-12 md:py-20">
            <div className="container mx-auto px-4 text-center">
              <h1 className="font-display text-3xl md:text-5xl font-extrabold text-foreground">
                Shop All Flavors
              </h1>
              <p className="text-muted-foreground mt-4 max-w-md mx-auto">
                Premium roasted makhana in irresistible flavors. 10g protein, zero guilt.
              </p>
            </div>
          </section>

          {/* Tabs */}
          <section className="py-8 sticky top-20 z-30 bg-background/95 backdrop-blur-sm border-b">
            <div className="container mx-auto px-4 flex justify-center overflow-x-auto">
              <div className="flex space-x-2 md:space-x-4 min-w-max">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedType(tab.id)}
                    className={`px-6 py-2 rounded-full font-bold text-sm md:text-base transition-all duration-300 ${selectedType === tab.id
                      ? 'bg-primary text-secondary shadow-lg scale-105'
                      : 'bg-secondary/50 text-foreground hover:bg-secondary hover:text-primary border border-transparent'
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Products Grid */}
          <section className="py-12">
            <div className="container mx-auto px-4">
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
                </div>
              ) : shopProducts.length === 0 ? (
                <div className="text-center py-20">
                  <h3 className="text-2xl font-bold text-muted-foreground">No products found.</h3>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {shopProducts.map((sp, index) => (
                    <div
                      key={sp.productVariantId}
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <ProductCard product={mapToProductCardProps(sp)} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </main>

        <Footer />
        <CartBar />
        <CartDrawer />
      </div>
    </>
  );
};

export default ShopPage;
