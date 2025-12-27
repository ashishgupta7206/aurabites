
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { reviews } from '@/data/products';
import { useCart } from '@/contexts/CartContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CartBar } from '@/components/CartBar';
import { CartDrawer } from '@/components/CartDrawer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, Minus, Plus, Share2, Star, Truck, ShieldCheck, Leaf, Flame } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { Helmet } from 'react-helmet-async';

const ProductDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { items, addToCart, removeFromCart, updateQuantity, setIsCartOpen } = useCart();
    const { toast } = useToast();
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

    // API Types
    interface NutritionInfo {
        id: number;
        energyKcal: number;
        proteinG: number;
        carbohydrateG: number;
        totalSugarG: number;
        addedSugarG: number;
        totalFatG: number;
        saturatedFatG: number;
        transFatG: number;
        cholesterolMg: number;
        sodiumMg: number;
        ingredients: string;
        servingSize: string;
    }

    interface ProductVariant {
        id: number;
        name: string;
        sku: string;
        price: number;
        mrp: number;
        discountPercent: number;
        stockQty: number;
        size: string;
        weight: string | null;
        color: string | null;
        barcode: string | null;
        isActive: boolean;
        categorySortOrder: number | null;
        nutritionInfo: NutritionInfo;
        rating: string;
        storageInstructions: string | null;
        productVariantMktStatus: string;
        productVariantMktStatusSortOrder: number | null;
        sortOrder: number | null;
        productType: string;
        listOfVariantInCombo: any[];
        images: { id: number; imageUrl: string; sortOrder: number }[];
    }

    interface ApiProduct {
        id: number;
        name: string;
        slug: string;
        shortDescription: string;
        longDescription: string;
        mainImage: string;
        status: string;
        categoryId: number;
        categoryName: string;
        variants: ProductVariant[];
        images: { id: number; imageUrl: string; sortOrder: number }[];
    }

    interface ApiResponse {
        success: boolean;
        message: string;
        data: ApiProduct;
    }

    // State
    const [apiProduct, setApiProduct] = useState<ApiProduct | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);
    const [activeImage, setActiveImage] = useState<string>('');
    const [pincode, setPincode] = useState('');
    const [deliveryStatus, setDeliveryStatus] = useState<null | 'success' | 'error'>(null);

    // Fetch Product Data
    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${API_BASE_URL}/products/${id}`);
                const data: ApiResponse = await response.json();

                if (data.success && data.data) {
                    setApiProduct(data.data);
                    setActiveImage(data.data.mainImage);
                    // Default to first variant
                    if (data.data.variants && data.data.variants.length > 0) {
                        setSelectedVariantId(data.data.variants[0].id);
                    }
                } else {
                    setApiProduct(null); // Explicitly set to null if not successful
                }
            } catch (error) {
                console.error("Failed to fetch product", error);
                toast({
                    title: "Error",
                    description: "Failed to load product details",
                    variant: "destructive"
                });
                setApiProduct(null); // Ensure product is null on error
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
            window.scrollTo(0, 0);
        }
    }, [id, API_BASE_URL, toast]);

    // Derived State
    const currentVariant = apiProduct?.variants.find(v => v.id === selectedVariantId) || apiProduct?.variants[0];

    // Update active image when variant changes
    useEffect(() => {
        if (currentVariant?.images && currentVariant.images.length > 0) {
            setActiveImage(currentVariant.images[0].imageUrl);
        } else if (apiProduct?.mainImage) {
            setActiveImage(apiProduct.mainImage);
        }
    }, [selectedVariantId, apiProduct]);

    // Fallback/Mapping
    const currentPrice = currentVariant?.price || 0;
    const currentOriginalPrice = currentVariant?.mrp;
    const selectedWeight = currentVariant?.size || 'Standard';

    // Collect all images to display: Variant images take precedence, then Product Main Image, then Product Gallery
    const displayImages = [...(currentVariant?.images?.map(i => i.imageUrl) || [])].filter(Boolean) as string[];
    // Remove duplicates
    const uniqueImages = Array.from(new Set(displayImages));


    // Cart Logic
    // Find cart item by VARIANT ID
    const cartItem = items.find(item => item.id === String(currentVariant?.id));
    const quantityInCart = cartItem ? cartItem.quantity : 0;

    // Helper to determine flavor color style (simplified mapping for now)
    const getFlavorColor = (name: string): any => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes('cream')) return 'cream-onion';
        if (lowerName.includes('peri')) return 'peri-peri';
        if (lowerName.includes('mint') || lowerName.includes('pudina')) return 'mint';
        if (lowerName.includes('tandoori')) return 'tandoori';
        if (lowerName.includes('cheese')) return 'gold';
        return 'himalayan'; // Default
    };

    const handleAddToCart = () => {
        if (!apiProduct || !currentVariant) return;

        addToCart({
            id: String(currentVariant.id), // Using Variant ID
            name: currentVariant.name || apiProduct.name, // Use Variant Name
            flavor: currentVariant.name || apiProduct.name,
            price: currentPrice,
            image: currentVariant.images?.[0]?.imageUrl || apiProduct.mainImage,
            flavorColor: getFlavorColor(apiProduct.name),
            quantity: 1,
        });
        toast({
            title: "Added to cart",
            description: `${currentVariant.name || apiProduct.name} (${selectedWeight}) added.`,
        });
        setIsCartOpen(true);
    };

    const handleIncrement = () => {
        if (!apiProduct || !currentVariant) return;
        addToCart({
            id: String(currentVariant.id),
            name: currentVariant.name || apiProduct.name,
            flavor: currentVariant.name || apiProduct.name,
            price: currentPrice,
            image: currentVariant?.images?.[0]?.imageUrl || apiProduct.mainImage,
            flavorColor: getFlavorColor(apiProduct.name),
            quantity: 1
        });
    };

    const handleDecrement = () => {
        if (!apiProduct || !currentVariant) return;
        if (quantityInCart > 1) {
            updateQuantity(String(currentVariant.id), quantityInCart - 1);
        } else {
            removeFromCart(String(currentVariant.id));
        }
    };

    const handleBuyNow = () => {
        if (quantityInCart === 0) {
            handleAddToCart();
        }
        navigate('/checkout');
    };

    const checkPincode = () => {
        if (pincode.length === 6) {
            setDeliveryStatus('success');
        } else {
            setDeliveryStatus('error');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            </div>
        );
    }

    if (!apiProduct) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <h2 className="text-2xl font-display font-bold mb-4">Product not found</h2>
                    <Button onClick={() => navigate('/shop')}>Back to Shop</Button>
                </div>
            </div>
        );
    }

    // Hardcoded related products for now as API doesn't return them yet
    // const relatedProducts = products.filter((p) => String(p.categoryId) === String(apiProduct.categoryId) && p.id !== String(apiProduct.id)).slice(0, 4);


    return (
        <>
            <Helmet>
                <title>{currentVariant?.name || apiProduct.name} | Aurabites</title>
                <meta name="description" content={apiProduct.shortDescription} />
            </Helmet>

            <div className="min-h-screen bg-background">
                <Navbar />

                <main className="container mx-auto px-4 py-8 pt-24">
                    {/* Breadcrumb */}
                    <div className="flex items-center text-sm text-muted-foreground mb-8">
                        <span className="hover:text-primary cursor-pointer" onClick={() => navigate('/')}>Home</span>
                        <span className="mx-2">/</span>
                        <span className="hover:text-primary cursor-pointer" onClick={() => navigate('/shop')}>Shop</span>
                        <span className="mx-2">/</span>
                        <span className="text-foreground font-medium">{apiProduct.name}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 mb-16">
                        {/* Left Column: Images */}
                        <div className="space-y-4">
                            <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-white to-gray-50 border border-border shadow-soft group">
                                <img
                                    src={activeImage}
                                    alt={apiProduct.name}
                                    className="w-full h-full object-contain p-8 transition-transform duration-500 group-hover:scale-110"
                                />

                                {/* Floating Badges */}
                                <div className="absolute top-4 left-4 flex flex-col gap-2">
                                    {currentVariant?.productVariantMktStatus === 'BEST_SELLER' && (
                                        <Badge className="bg-orange-500 hover:bg-orange-600">Bestseller</Badge>
                                    )}
                                    {currentVariant?.productVariantMktStatus === 'NEW_LAUNCH' && (
                                        <Badge className="bg-green-500 hover:bg-green-600">New Launch</Badge>
                                    )}
                                    {currentVariant?.productVariantMktStatus === 'FEATURED' && (
                                        <Badge className="bg-pink-500 hover:bg-pink-600">Featured</Badge>
                                    )}
                                    {currentVariant?.productVariantMktStatus === 'TRENDING' && (
                                        <Badge className="bg-orange-500 hover:bg-orange-600">Trending</Badge>
                                    )}
                                </div>
                            </div>

                            {/* Thumbnails */}
                            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                                {uniqueImages.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveImage(img)}
                                        className={`relative w-24 h-24 flex-shrink-0 rounded-xl border-2 overflow-hidden bg-white ${activeImage === img ? 'border-primary ring-2 ring-primary/20' : 'border-transparent hover:border-gray-200'
                                            }`}
                                    >
                                        <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-contain p-2" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Right Column: Product Info */}
                        <div className="flex flex-col">
                            <div className="mb-6">
                                <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">{currentVariant?.name || apiProduct.name}</h1>
                                <p className="text-lg text-muted-foreground mb-4">{apiProduct.shortDescription}</p>

                                <div className="flex items-center gap-4 mb-4">
                                    <div className="flex items-center text-yellow-400">
                                        <Star className="fill-current w-5 h-5" />
                                        <Star className="fill-current w-5 h-5" />
                                        <Star className="fill-current w-5 h-5" />
                                        <Star className="fill-current w-5 h-5" />
                                        <Star className="fill-current w-5 h-5 text-gray-300" />
                                        <span className="text-foreground font-semibold ml-2 text-sm">{currentVariant?.rating || '4.8'}</span>
                                    </div>
                                    <span className="text-muted-foreground text-sm">|</span>
                                    {/* <span className="text-primary text-sm font-medium hover:underline cursor-pointer">128 Reviews</span> */}
                                </div>

                                <div className="flex items-baseline gap-3">
                                    <span className="text-3xl font-display font-bold text-primary">₹{currentPrice}</span>
                                    {currentOriginalPrice && currentOriginalPrice > currentPrice && (
                                        <span className="text-lg text-muted-foreground line-through decoration-red-500/50">₹{currentOriginalPrice}</span>
                                    )}
                                    {currentOriginalPrice && currentOriginalPrice > currentPrice && (
                                        <Badge variant="secondary" className="text-green-700 bg-green-100">
                                            {Math.round(((currentOriginalPrice - currentPrice) / currentOriginalPrice) * 100)}% OFF
                                        </Badge>
                                    )}
                                </div>
                                <p className="text-sm text-green-600 font-medium mt-1">Inclusive of all taxes</p>
                            </div>

                            <Separator className="mb-6" />

                            {/* Flavor Selection */}
                            {/* Removed as flavors are part of product name, not separate selection */}

                            {/* Weight/Variant Selection */}
                            <div className="mb-6">
                                <label className="text-sm font-medium text-foreground mb-3 block">Pack Weight</label>
                                <div className="flex gap-4">
                                    {apiProduct.variants.map((variant) => (
                                        <label
                                            key={variant.id}
                                            className={`relative flex items-center justify-center px-4 py-3 rounded-xl border-2 cursor-pointer transition-all ${selectedVariantId === variant.id
                                                ? 'border-primary bg-primary/5 text-primary'
                                                : 'border-input hover:border-gray-300'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="weight"
                                                className="sr-only"
                                                checked={selectedVariantId === variant.id}
                                                onChange={() => setSelectedVariantId(variant.id)}
                                            />
                                            <span className="font-medium">{variant.size}  ({variant.productType.toLowerCase()})</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Quantity & Actions */}
                            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                                {quantityInCart === 0 ? (
                                    <Button
                                        size="lg"
                                        className="flex-1 text-base h-auto py-3 rounded-xl shadow-glow hover:shadow-lg transition-all"
                                        onClick={handleAddToCart}
                                    >
                                        Add to Cart
                                    </Button>
                                ) : (
                                    <div className="flex-1 flex items-center justify-between border-2 border-primary/20 rounded-xl bg-primary/5 p-1 h-auto min-h-[52px]">
                                        <button
                                            onClick={handleDecrement}
                                            className="w-12 h-full flex items-center justify-center rounded-lg hover:bg-white text-primary transition-colors"
                                        >
                                            <Minus className="w-5 h-5" />
                                        </button>
                                        <span className="font-display font-bold text-xl text-primary">{quantityInCart}</span>
                                        <button
                                            onClick={handleIncrement}
                                            className="w-12 h-full flex items-center justify-center rounded-lg hover:bg-white text-primary transition-colors"
                                        >
                                            <Plus className="w-5 h-5" />
                                        </button>
                                    </div>
                                )}

                                <Button
                                    size="lg"
                                    variant="secondary"
                                    className="flex-1 text-base h-auto py-3 rounded-xl border-2 border-primary/10 hover:bg-primary/5 text-primary"
                                    onClick={handleBuyNow}
                                >
                                    Buy Now
                                </Button>
                            </div>

                            {/* Trust Badges */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-secondary/30 rounded-2xl mb-6">
                                <div className="flex flex-col items-center text-center gap-2">
                                    <div className="p-2 bg-white rounded-full shadow-sm">
                                        <Leaf className="w-5 h-5 text-green-600" />
                                    </div>
                                    <span className="text-xs font-medium">100% Natural</span>
                                </div>
                                <div className="flex flex-col items-center text-center gap-2">
                                    <div className="p-2 bg-white rounded-full shadow-sm">
                                        <Flame className="w-5 h-5 text-orange-500" />
                                    </div>
                                    <span className="text-xs font-medium">Roasted</span>
                                </div>
                                <div className="flex flex-col items-center text-center gap-2">
                                    <div className="p-2 bg-white rounded-full shadow-sm">
                                        <ShieldCheck className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <span className="text-xs font-medium">Gluten Free</span>
                                </div>
                                <div className="flex flex-col items-center text-center gap-2">
                                    <svg className="w-9 h-9 p-2 bg-white rounded-full shadow-sm text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <span className="text-xs font-medium">High Protein</span>
                                </div>
                            </div>

                            {/* Pincode Check */}
                            {/* <div className="flex items-center gap-3 p-3 border border-dashed border-gray-300 rounded-lg max-w-sm">
                                <Truck className="w-5 h-5 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Enter Pincode"
                                    maxLength={6}
                                    value={pincode}
                                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                                    className="flex-1 bg-transparent border-none text-sm focus:outline-none"
                                />
                                <button
                                    onClick={checkPincode}
                                    className="text-xs font-bold text-primary hover:text-primary/80"
                                >
                                    CHECK
                                </button>
                            </div> */}
                            {/* {deliveryStatus === 'success' && (
                                <p className="text-xs text-green-600 p-2">Delivery available by {new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                            )}
                            {deliveryStatus === 'error' && (
                                <p className="text-xs text-destructive p-2">Invalid Pincode</p>
                            )} */}

                        </div>
                    </div>

                    {/* Product Details Tabs */}
                    <div className="max-w-4xl mx-auto mb-20 scroll-mt-24">
                        <Tabs defaultValue="description" className="w-full">
                            <TabsList className="w-full justify-start bg-transparent border-b rounded-none h-auto p-0 mb-8 overflow-x-auto">
                                {['Description', 'Nutrition', 'Ingredients', 'Storage'].map((tab) => (
                                    <TabsTrigger
                                        key={tab}
                                        value={tab.toLowerCase()}
                                        className="px-6 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent text-muted-foreground font-medium text-base"
                                    >
                                        {tab}
                                    </TabsTrigger>
                                ))}
                            </TabsList>

                            <TabsContent value="description" className="animate-fade-in space-y-4 text-muted-foreground leading-relaxed">
                                <p>{apiProduct.longDescription}</p>
                                <div className="bg-secondary/20 p-6 rounded-xl my-6">
                                    <h3 className="font-display font-bold text-foreground mb-4">Why you'll love it:</h3>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary"></span>Zero Trans Fat</li>
                                        <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary"></span>Rich in Anti-oxidants</li>
                                        <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary"></span>Low G.I. Index</li>
                                        <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary"></span>No Artificial Preservatives</li>
                                    </ul>
                                </div>
                            </TabsContent>

                            <TabsContent value="nutrition" className="animate-fade-in">
                                <div className="border rounded-xl p-6 max-w-md bg-white">
                                    <h3 className="font-bold text-lg mb-4">Nutritional Facts (per {currentVariant?.nutritionInfo?.servingSize || '100g'})</h3>
                                    <div className="space-y-3">
                                        {currentVariant?.nutritionInfo?.energyKcal !== undefined && (
                                            <div className="flex justify-between border-b border-dashed pb-2">
                                                <span>Energy</span>
                                                <span className="font-medium">{currentVariant.nutritionInfo.energyKcal} Kcal</span>
                                            </div>
                                        )}
                                        {currentVariant?.nutritionInfo?.proteinG !== undefined && (
                                            <div className="flex justify-between border-b border-dashed pb-2">
                                                <span>Protein</span>
                                                <span className="font-medium">{currentVariant.nutritionInfo.proteinG}g</span>
                                            </div>
                                        )}
                                        {currentVariant?.nutritionInfo?.carbohydrateG !== undefined && (
                                            <div className="flex justify-between border-b border-dashed pb-2">
                                                <span>Carbohydrates</span>
                                                <span className="font-medium">{currentVariant.nutritionInfo.carbohydrateG}g</span>
                                            </div>
                                        )}
                                        {currentVariant?.nutritionInfo?.totalSugarG !== undefined && (
                                            <div className="flex justify-between border-b border-dashed pb-2">
                                                <span>Total Sugar</span>
                                                <span className="font-medium">{currentVariant.nutritionInfo.totalSugarG}g</span>
                                            </div>
                                        )}
                                        {currentVariant?.nutritionInfo?.addedSugarG !== undefined && (
                                            <div className="flex justify-between border-b border-dashed pb-2">
                                                <span>Added Sugar</span>
                                                <span className="font-medium">{currentVariant.nutritionInfo.addedSugarG}g</span>
                                            </div>
                                        )}
                                        {currentVariant?.nutritionInfo?.totalFatG !== undefined && (
                                            <div className="flex justify-between border-b border-dashed pb-2">
                                                <span>Total Fat</span>
                                                <span className="font-medium">{currentVariant.nutritionInfo.totalFatG}g</span>
                                            </div>
                                        )}
                                        {currentVariant?.nutritionInfo?.saturatedFatG !== undefined && (
                                            <div className="flex justify-between border-b border-dashed pb-2">
                                                <span>Saturated Fat</span>
                                                <span className="font-medium">{currentVariant.nutritionInfo.saturatedFatG}g</span>
                                            </div>
                                        )}
                                        {currentVariant?.nutritionInfo?.transFatG !== undefined && (
                                            <div className="flex justify-between border-b border-dashed pb-2">
                                                <span>Trans Fat</span>
                                                <span className="font-medium">{currentVariant.nutritionInfo.transFatG}g</span>
                                            </div>
                                        )}
                                        {currentVariant?.nutritionInfo?.cholesterolMg !== undefined && (
                                            <div className="flex justify-between border-b border-dashed pb-2">
                                                <span>Cholesterol</span>
                                                <span className="font-medium">{currentVariant.nutritionInfo.cholesterolMg}mg</span>
                                            </div>
                                        )}
                                        {currentVariant?.nutritionInfo?.sodiumMg !== undefined && (
                                            <div className="flex justify-between pb-2">
                                                <span>Sodium</span>
                                                <span className="font-medium">{currentVariant.nutritionInfo.sodiumMg}mg</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="ingredients" className="animate-fade-in text-muted-foreground">
                                <p>{currentVariant?.nutritionInfo?.ingredients || " "}</p>
                                <p className="mt-4 text-sm bg-yellow-50 text-yellow-800 p-3 rounded-lg border border-yellow-200 inline-block">Allergen Advice: Processed in a facility that handles nuts and seeds.</p>
                            </TabsContent>

                            <TabsContent value="storage" className="animate-fade-in text-muted-foreground">
                                <p>{currentVariant?.storageInstructions || "Store in a cool, dry place. Once opened, store in an airtight container to retain crunchiness. Best consumed within 6 months of manufacture."}</p>
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* Customer Reviews */}
                    <section className="mb-20">
                        <h2 className="font-display text-2xl font-bold mb-8">What our customers say</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {reviews.slice(0, 3).map((review) => (
                                <div key={review.id} className="bg-white p-6 rounded-2xl border hover:shadow-medium transition-shadow">
                                    <div className="flex items-center gap-2 mb-3 text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-200'}`} />
                                        ))}
                                    </div>
                                    <p className="text-foreground/80 mb-4 text-sm leading-relaxed">"{review.comment}"</p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                            {review.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm">{review.name}</p>
                                            <p className="text-xs text-muted-foreground">Verified Buyer</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Related Products */}
                    <section>
                        <h2 className="font-display text-2xl font-bold mb-8">You might also like</h2>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* {relatedProducts.map((p) => (
                                <div key={p.id} className="group cursor-pointer" onClick={() => navigate(`/product/${p.id}`)}>
                                    <div className="rounded-2xl bg-secondary/20 p-6 mb-4 relative overflow-hidden">
                                        <img src={p.image} alt={p.name} className="w-full aspect-square object-contain transition-transform duration-500 group-hover:scale-110" />
                                    </div>
                                    <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">{p.name}</h3>
                                    <p className="text-muted-foreground text-sm mb-2">{p.flavor}</p>
                                    <p className="font-bold text-primary">₹{p.price}</p>
                                </div>
                            ))} */}
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

export default ProductDetailPage;
