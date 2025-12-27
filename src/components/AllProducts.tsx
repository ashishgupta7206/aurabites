import { useState, useEffect } from 'react';
import { ProductCard } from './ProductCard';
import { useToast } from '@/components/ui/use-toast';

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
}

export const AllProducts = () => {
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/products/search`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productType: null,
            pagination: {
              page: 0,
              size: 20
            },
            sorting: [
              { orderBy: "id", order: "desc" }
            ]
          }),
        });

        if (response.ok) {
          const data: ApiResponse = await response.json();
          if (data.success && data.data) {
            setProducts(data.data);
          }
        }
      } catch (error) {
        console.error("Error fetching all products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [API_BASE_URL]);

  // Map to ProductCard props
  const mapToProductCardProps = (sp: ShopProduct) => {
    return {
      id: String(sp.productVariantId),
      productId: sp.productId,
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
    <section className="py-16 md:py-24 bg-background relative overflow-hidden">
      {/* Background Doodles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-[5%] text-6xl opacity-10 animate-float">🫛</div>
        <div className="absolute top-40 right-[8%] text-5xl opacity-10 animate-float-slow" style={{ animationDelay: '1s' }}>✨</div>
        <div className="absolute bottom-40 left-[12%] text-4xl opacity-10 animate-float" style={{ animationDelay: '0.5s' }}>🌾</div>
        <div className="absolute bottom-20 right-[15%] text-5xl opacity-10 animate-float-slow" style={{ animationDelay: '1.5s' }}>🍃</div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-sm font-medium text-primary uppercase tracking-wider">
            Complete Collection
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-foreground mt-2">
            All Flavors
          </h2>
          <p className="text-muted-foreground mt-3 max-w-md mx-auto">
            Explore our entire range of premium makhana snacks
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-10">Loading products...</div>
          ) : (
            products.map((sp, index) => (
              <div
                key={sp.productVariantId}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <ProductCard product={mapToProductCardProps(sp)} />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};
