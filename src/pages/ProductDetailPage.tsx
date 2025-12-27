
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { products, reviews } from '@/data/products';
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

    const product = products.find((p) => p.id === id);
    const relatedProducts = products.filter((p) => p.category === product?.category && p.id !== id).slice(0, 4);

    // State
    const [selectedWeight, setSelectedWeight] = useState('100g');
    const [activeImage, setActiveImage] = useState(product?.image);
    const [pincode, setPincode] = useState('');
    const [deliveryStatus, setDeliveryStatus] = useState<null | 'success' | 'error'>(null);

    // Get quantity from cart
    const cartItem = items.find(item => item.id === product?.id);
    const quantityInCart = cartItem ? cartItem.quantity : 0;

    // Reset state when product changes
    useEffect(() => {
        if (product) {
            setActiveImage(product.image);
            setSelectedWeight('100g');
            window.scrollTo(0, 0);
        }
    }, [product]);

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <h2 className="text-2xl font-display font-bold mb-4">Product not found</h2>
                    <Button onClick={() => navigate('/shop')}>Back to Shop</Button>
                </div>
            </div>
        );
    }

    // Calculate dynamic price based on weight
    const getPrice = () => {
        let multiplier = 1;
        if (selectedWeight === '30g') multiplier = 0.4;
        if (selectedWeight === '200g') multiplier = 1.8;
        return Math.round(product.price * multiplier);
    };

    const getOriginalPrice = () => {
        if (!product.originalPrice) return null;
        let multiplier = 1;
        if (selectedWeight === '30g') multiplier = 0.4;
        if (selectedWeight === '200g') multiplier = 1.8;
        return Math.round(product.originalPrice * multiplier);
    };

    const currentPrice = getPrice();
    const currentOriginalPrice = getOriginalPrice();

    const handleAddToCart = () => {
        addToCart({
            id: product.id,
            name: product.name,
            flavor: product.flavor,
            price: currentPrice,
            image: product.image,
            flavorColor: product.flavorColor,
            quantity: 1,
        });
        toast({
            title: "Added to cart",
            description: `${product.name} (${selectedWeight}) added.`,
        });
        setIsCartOpen(true);
    };

    const handleIncrement = () => {
        addToCart({
            id: product.id,
            name: product.name,
            flavor: product.flavor,
            price: currentPrice,
            image: product.image,
            flavorColor: product.flavorColor,
            quantity: 1
        });
    };

    const handleDecrement = () => {
        if (quantityInCart > 1) {
            updateQuantity(product.id, quantityInCart - 1);
        } else {
            removeFromCart(product.id);
        }
    };

    const handleBuyNow = () => {
        if (quantityInCart === 0) {
            addToCart({
                id: product.id,
                name: product.name,
                flavor: product.flavor,
                price: currentPrice,
                image: product.image,
                flavorColor: product.flavorColor,
                quantity: 1,
            });
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

    return (
        <>
            <Helmet>
                <title>{product.name} | Aurabites</title>
                <meta name="description" content={product.description} />
            </Helmet>

            <div className="min-h-screen bg-background">
                <Navbar />

                <main className="container mx-auto px-4 py-8 pt-24">
                    {/* Breadcrumb - simplified */}
                    <div className="flex items-center text-sm text-muted-foreground mb-8">
                        <span className="hover:text-primary cursor-pointer" onClick={() => navigate('/')}>Home</span>
                        <span className="mx-2">/</span>
                        <span className="hover:text-primary cursor-pointer" onClick={() => navigate('/shop')}>Shop</span>
                        <span className="mx-2">/</span>
                        <span className="text-foreground font-medium">{product.name}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 mb-16">
                        {/* Left Column: Images */}
                        <div className="space-y-4">
                            <div
                                className={`relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-white to-gray-50 border border-border shadow-soft group`}
                            >
                                <img
                                    src={activeImage}
                                    alt={product.name}
                                    className="w-full h-full object-contain p-8 transition-transform duration-500 group-hover:scale-110"
                                />

                                {/* Floating Badges */}
                                <div className="absolute top-4 left-4 flex flex-col gap-2">
                                    {product.isBestseller && (
                                        <Badge className="bg-orange-500 hover:bg-orange-600">Bestseller</Badge>
                                    )}
                                    {product.isNew && (
                                        <Badge className="bg-green-500 hover:bg-green-600">New Launch</Badge>
                                    )}
                                </div>
                            </div>

                            {/* Thumbnails */}
                            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                                {[product.image, product.image, product.image].map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveImage(img)}
                                        className={`relative w-24 h-24 flex-shrink-0 rounded-xl border-2 overflow-hidden bg-white ${activeImage === img && i === 0 ? 'border-primary ring-2 ring-primary/20' : 'border-transparent hover:border-gray-200'
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
                                <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">{product.name}</h1>
                                <p className="text-lg text-muted-foreground mb-4">Light. Crunchy. Guilt-Free.</p>

                                <div className="flex items-center gap-4 mb-4">
                                    <div className="flex items-center text-yellow-400">
                                        <Star className="fill-current w-5 h-5" />
                                        <Star className="fill-current w-5 h-5" />
                                        <Star className="fill-current w-5 h-5" />
                                        <Star className="fill-current w-5 h-5" />
                                        <Star className="fill-current w-5 h-5 text-gray-300" />
                                        <span className="text-foreground font-semibold ml-2 text-sm">4.8</span>
                                    </div>
                                    <span className="text-muted-foreground text-sm">|</span>
                                    {/* <span className="text-primary text-sm font-medium hover:underline cursor-pointer">128 Reviews</span> */}
                                </div>

                                <div className="flex items-baseline gap-3">
                                    <span className="text-3xl font-display font-bold text-primary">₹{currentPrice}</span>
                                    {currentOriginalPrice && (
                                        <span className="text-lg text-muted-foreground line-through decoration-red-500/50">₹{currentOriginalPrice}</span>
                                    )}
                                    {currentOriginalPrice && (
                                        <Badge variant="secondary" className="text-green-700 bg-green-100">
                                            {Math.round(((currentOriginalPrice - currentPrice) / currentOriginalPrice) * 100)}% OFF
                                        </Badge>
                                    )}
                                </div>
                                <p className="text-sm text-green-600 font-medium mt-1">Inclusive of all taxes</p>
                            </div>

                            <Separator className="mb-6" />

                            {/* Flavor Selection */}
                            {/* <div className="mb-6">
                                <label className="text-sm font-medium text-foreground mb-3 block">Select Flavor</label>
                                <div className="flex flex-wrap gap-3">
                                    {products.map((p) => (
                                        <button
                                            key={p.id}
                                            onClick={() => navigate(`/product/${p.id}`)}
                                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${p.id === product.id
                                                ? 'bg-primary text-white shadow-lg shadow-primary/25 scale-105'
                                                : 'bg-white border border-input text-foreground hover:bg-gray-50'
                                                }`}
                                        >
                                            {p.flavor}
                                        </button>
                                    ))}
                                </div>
                            </div> */}

                            {/* Weight Selection */}
                            <div className="mb-6">
                                <label className="text-sm font-medium text-foreground mb-3 block">Pack Weight</label>
                                <div className="flex gap-4">
                                    {['30g', '100g', '200g'].map((weight) => (
                                        <label
                                            key={weight}
                                            className={`relative flex items-center justify-center px-4 py-3 rounded-xl border-2 cursor-pointer transition-all ${selectedWeight === weight
                                                ? 'border-primary bg-primary/5 text-primary'
                                                : 'border-input hover:border-gray-300'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="weight"
                                                className="sr-only"
                                                checked={selectedWeight === weight}
                                                onChange={() => setSelectedWeight(weight)}
                                            />
                                            <span className="font-medium">{weight}</span>
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
                                <p>
                                    Experience the perfect blend of health and taste with Aurabites {product.flavor} Makhana.
                                    Sourced from the finest farms in Bihar, our fox nuts are roasted to perfection (never fried!)
                                    and seasoned with premium {product.flavor} spices that will leave your taste buds craving more.
                                </p>
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
                                    <h3 className="font-bold text-lg mb-4">Nutritional Facts (per 100g)</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between border-b border-dashed pb-2">
                                            <span>Energy</span>
                                            <span className="font-medium">480 Kcal</span>
                                        </div>
                                        <div className="flex justify-between border-b border-dashed pb-2">
                                            <span>Protein</span>
                                            <span className="font-medium">10.5g</span>
                                        </div>
                                        <div className="flex justify-between border-b border-dashed pb-2">
                                            <span>Carbohydrates</span>
                                            <span className="font-medium">68g</span>
                                        </div>
                                        <div className="flex justify-between border-b border-dashed pb-2">
                                            <span>Fat</span>
                                            <span className="font-medium">20g</span>
                                        </div>
                                        <div className="flex justify-between pb-2">
                                            <span>Sugar</span>
                                            <span className="font-medium">2g</span>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="ingredients" className="animate-fade-in text-muted-foreground">
                                <p>Makhana (Fox Nuts), Edible Vegetable Oil (Rice Bran Oil), Spices & Condiments, Iodised Salt, Sugar, Acidity Regulators, Natural Flavors.</p>
                                <p className="mt-4 text-sm bg-yellow-50 text-yellow-800 p-3 rounded-lg border border-yellow-200 inline-block">Allergen Advice: Processed in a facility that handles nuts and seeds.</p>
                            </TabsContent>

                            <TabsContent value="storage" className="animate-fade-in text-muted-foreground">
                                <p>Store in a cool, dry place. Once opened, store in an airtight container to retain crunchiness. Best consumed within 6 months of manufacture.</p>
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
                            {relatedProducts.map((p) => (
                                <div key={p.id} className="group cursor-pointer" onClick={() => navigate(`/product/${p.id}`)}>
                                    <div className="rounded-2xl bg-secondary/20 p-6 mb-4 relative overflow-hidden">
                                        <img src={p.image} alt={p.name} className="w-full aspect-square object-contain transition-transform duration-500 group-hover:scale-110" />
                                    </div>
                                    <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">{p.name}</h3>
                                    <p className="text-muted-foreground text-sm mb-2">{p.flavor}</p>
                                    <p className="font-bold text-primary">₹{p.price}</p>
                                </div>
                            ))}
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
