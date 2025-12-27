import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CartBar } from '@/components/CartBar';
import { CartDrawer } from '@/components/CartDrawer';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

// Interfaces based on API Response (Same as ShopPage)
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
interface ApiCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  parentId: number | null;
  status: string;
}

interface CategoriesApiResponse {
  success: boolean;
  message: string;
  data: ApiCategory[];
}

const CategoryPage = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [categoryProducts, setCategoryProducts] = useState<ShopProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [category, setCategory] = useState<any>(null); // To store merged category data
  const [categoryLoading, setCategoryLoading] = useState<boolean>(true);
  const { toast } = useToast();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

  const tabs = [
    { id: 'ALL', label: 'ALL PRODUCTS' },
    { id: 'POUCH', label: 'POUCH' },
    { id: 'JAR', label: 'JAR' },
  ];

  // Fetch Category Details
  useEffect(() => {
    const fetchCategoryDetails = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/categories/search/parent`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ page: 0, size: 100, sort: 'name,asc' }),
        });

        if (response.ok) {
          const data: CategoriesApiResponse = await response.json();
          if (data.success && data.data) {
            const foundApiCategory = data.data.find(c => String(c.id) === id);
            if (foundApiCategory) {
              const index = Number(foundApiCategory.id) || 0;

              setCategory({
                id: String(foundApiCategory.id),
                name: foundApiCategory.name,
                slug: foundApiCategory.slug,
                description: foundApiCategory.description,
              });
            }
          }
        }
      } catch (error) {
        console.error("Error fetching category details:", error);
      } finally {
        setCategoryLoading(false);
      }
    };

    fetchCategoryDetails();
  }, [id, API_BASE_URL]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const productType = selectedType === 'ALL' ? null : selectedType;
        // Assuming the API expects numeric ID if possible, or string. 
        // The mock/user data used Strings "5", but typescript types might vary. 
        // If `id` in URL is "c1" (from mock data), it won't match API "5".
        // However, based on user request "categoryId":"5(id)", I will assume the URL id is what we need.
        // If the URL is using slug or 'c1', this might break without a mapping.
        // For now, passing `id` directly properly.

        const response = await fetch(`${API_BASE_URL}/products/search`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productType: productType,
            categoryId: id,
            pagination: {
              page: 0,
              size: 100
            },
            sorting: [
              { orderBy: "id", order: "desc" },
              { orderBy: "name", order: "asc" }
            ]
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const data: ApiResponse = await response.json();
        if (data.success) {
          setCategoryProducts(data.data);
        } else {
          // If it fails (maybe wrong ID format?), we might want to show empty or error
          console.warn("API Error:", data.message);
          setCategoryProducts([]);
        }

      } catch (error) {
        console.error("Error fetching category products:", error);
        setCategoryProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [id, selectedType, API_BASE_URL]);

  if (!category) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold mb-4">Category Not Found</h1>
          <Link to="/">
            <Button className="rounded-full">Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Map to ProductCard props
  const mapToProductCardProps = (sp: ShopProduct) => {
    return {
      id: String(sp.productVariantId),
      productId: sp.productId, // Pass productId for linking
      name: sp.productVariantName,
      price: sp.price,
      originalPrice: sp.mrp,
      image: sp.images[0]?.imageUrl || sp.mainImage,
      flavor: sp.productName.replace('AURA BITES', '').replace('Makhana', '').trim(),
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
        <title>{category.name} – Aurabites Makhana Snacks</title>
        <meta name="description" content={`Shop ${category.name} from Aurabites. ${category.description}`} />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="pt-24 pb-32 md:pb-16">
          {/* Header */}
          <section className={`${category.gradient} py-12 md:py-20`}>
            <div className="container mx-auto px-4">
              <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>

              <div className="flex items-center gap-4">
                <span className="text-5xl">{category.icon}</span>
                <div>
                  <h1 className="font-display text-3xl md:text-4xl font-extrabold text-foreground">
                    {category.name}
                  </h1>
                  <p className="text-muted-foreground mt-2">{category.description}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Tabs */}
          <section className="py-8 sticky top-20 z-30 bg-background/95 backdrop-blur-sm border-b">
            <div className="container mx-auto px-4 flex justify-start md:justify-center overflow-x-auto">
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

          {/* Products */}
          <section className="py-12">
            <div className="container mx-auto px-4">
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
                </div>
              ) : categoryProducts.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-xl text-muted-foreground mb-4">No products found in this category.</p>
                  <Link to="/shop">
                    <Button className="rounded-full">Browse All Products</Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {categoryProducts.map((sp, index) => (
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

export default CategoryPage;
