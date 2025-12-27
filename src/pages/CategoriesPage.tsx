import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CartBar } from '@/components/CartBar';
import { CartDrawer } from '@/components/CartDrawer';
import { CategoryCard } from '@/components/CategoryCard';
import { Category } from '@/data/products';

interface ApiCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  parentId: number | null;
  status: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: ApiCategory[];
  errors: null;
  timestamp: string;
  pagination: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
}

const CategoriesPage = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/categories/search/parent`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            page: 0,
            size: 10,
            sort: 'name,asc',
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }

        const data: ApiResponse = await response.json();

        if (data.success && data.data) {
          const mappedCategories: Category[] = data.data.map((item, index) => {
            // Helper to assign consistent styles based on index or content
            const gradients = ['gradient-mint', 'gradient-teal', 'gradient-rust', 'gradient-gold'];
            const icons = ['🌾', '🌿', '🌰'];

            return {
              id: String(item.id),
              name: item.name,
              slug: item.slug,
              description: item.description,
              icon: icons[index % icons.length], // Rotate icons
              gradient: gradients[index % gradients.length], // Rotate gradients
              comingSoon: item.status !== 'ACTIVE',
            };
          });
          setCategories(mappedCategories);
        } else {
          setError('Failed to load categories');
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Something went wrong. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <>
      <Helmet>
        <title>Categories – Aurabites Makhana Snacks</title>
        <meta name="description" content="Browse Aurabites makhana categories. Roasted makhana, raw makhana, and premium dry fruits." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="pt-24 pb-32 md:pb-16">
          {/* Header */}
          <section className="gradient-cream py-12 md:py-20">
            <div className="container mx-auto px-4 text-center">
              <h1 className="font-display text-3xl md:text-5xl font-extrabold text-foreground">
                Browse Categories
              </h1>
              <p className="text-muted-foreground mt-4 max-w-md mx-auto">
                Find your perfect snack category
              </p>
            </div>
          </section>

          {/* Categories */}
          <section className="py-12">
            <div className="container mx-auto px-4">
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
                  <p className="mt-4 text-muted-foreground">Loading categories...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12 text-destructive">
                  <p>{error}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categories.map((category, index) => (
                    <div
                      key={category.id}
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <CategoryCard category={category} />
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

export default CategoriesPage;
