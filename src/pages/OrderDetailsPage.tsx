import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import { format } from "date-fns";

const OrderDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [orderDetails, setOrderDetails] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            if (!id) return;
            try {
                const baseUrl = import.meta.env?.VITE_API_BASE_URL;
                const token = Cookies.get("token");
                if (!token) {
                    navigate('/login');
                    return;
                }
                const res = await fetch(`${baseUrl}/orders/${id}`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await res.json();
                if (data?.success) {
                    setOrderDetails(data.data);
                } else {
                    setOrderDetails(null);
                }
            } catch (err) {
                console.error("Failed to fetch order details", err);
                setOrderDetails(null);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex flex-col pt-24 pb-12">
                <div className="container mx-auto px-4 max-w-3xl flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading order details...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!orderDetails) {
        return (
            <div className="min-h-screen bg-background flex flex-col pt-24 pb-12">
                <div className="container mx-auto px-4 max-w-3xl">
                    <Button variant="ghost" onClick={() => navigate('/orders')} className="mb-6 -ml-4 hover:bg-transparent">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Orders
                    </Button>
                    <div className="bg-card border border-border rounded-xl p-12 text-center space-y-4">
                        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                            <Package className="w-10 h-10 text-muted-foreground" />
                        </div>
                        <h2 className="text-xl font-semibold text-foreground">Order Not Found</h2>
                        <p className="text-muted-foreground max-w-md mx-auto">
                            We couldn't find the details for this order. It might not exist or there might be a network issue.
                        </p>
                    </div>
                </div>
            </div>
        );
    }
    console.log(orderDetails);
    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <Helmet>
                <title>{`Order #${orderDetails.id} Details – Aurabites`}</title>
            </Helmet>

            <div className="container mx-auto px-4 max-w-3xl">
                <Button variant="ghost" onClick={() => navigate('/orders')} className="mb-6 -ml-4 hover:bg-transparent text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Orders
                </Button>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="font-display text-3xl font-bold text-foreground">
                            Order #{orderDetails.id}
                        </h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Placed on {orderDetails.orderDate ? format(new Date(orderDetails.orderDate), "MMMM dd, yyyy 'at' h:mm a") : 'Unknown Date'}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <span className={`px-4 py-1.5 text-sm font-semibold rounded-full capitalize ${orderDetails.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                            Order: {orderDetails.status?.toLowerCase()}
                        </span>
                        <span className={`px-4 py-1.5 text-sm font-semibold rounded-full capitalize ${orderDetails.paymentStatus === 'SUCCESS' ? 'bg-green-100 text-green-700' : (orderDetails.paymentStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700')}`}>
                            Payment: {orderDetails.paymentStatus?.toLowerCase()}
                        </span>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                    {/* Items Section */}
                    <div className="p-6">
                        <h2 className="font-semibold text-lg mb-4">Items Summary</h2>
                        <div className="space-y-4">
                            {orderDetails.items?.map((item: any, idx: number) => (
                                <div key={idx} className="flex gap-4 p-4 rounded-lg border border-border/50 bg-background/50">
                                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-md flex items-center justify-center shrink-0 border border-border/30 overflow-hidden">
                                        {item.variantImage ? (
                                            <img src={item.variantImage} alt={item.productVariantName || item.productName} className="max-w-full max-h-full object-contain mix-blend-multiply p-2" />
                                        ) : (
                                            <Package className="w-8 h-8 text-muted-foreground" />
                                        )}
                                    </div>
                                    <div className="flex-1 flex flex-col justify-center min-w-0">
                                        <div className="flex justify-between items-start gap-4">
                                            <div>
                                                <h3 className="font-medium text-foreground line-clamp-2 pr-2">
                                                    {item.productVariantName || item.productName}
                                                </h3>
                                                {item.variantLabel && (
                                                    <p className="text-sm text-muted-foreground mt-1">Size: {item.variantLabel}</p>
                                                )}
                                            </div>
                                            <div className="text-right shrink-0">
                                                <p className="font-medium text-foreground whitespace-nowrap">₹{item.priceAtTime * item.quantity}</p>
                                                <p className="text-sm text-muted-foreground">₹{item.priceAtTime} each</p>
                                            </div>
                                        </div>
                                        <div className="mt-2 text-sm text-muted-foreground">
                                            Qty: <span className="font-medium text-foreground">{item.quantity}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="border-t border-border grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
                        {/* Delivery Section */}
                        <div className="p-6">
                            <h2 className="font-semibold text-lg mb-4">Delivery Details</h2>
                            <div className="text-sm bg-background/50 p-4 rounded-lg border border-border/50 h-[calc(100%-2rem)]">
                                <p className="whitespace-pre-wrap leading-relaxed text-muted-foreground">{orderDetails.addressSummary}</p>
                            </div>
                        </div>

                        {/* Order Summary Section */}
                        <div className="p-6 bg-muted/20">
                            <h2 className="font-semibold text-lg mb-4">Payment Summary</h2>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Subtotal</span>
                                    <span>₹{orderDetails.totalAmount}</span>
                                </div>
                                {orderDetails.discountAmount > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Discount</span>
                                        <span>-₹{orderDetails.discountAmount}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-muted-foreground pt-3 border-t border-border">
                                    <span className="font-medium text-foreground">Total Paid</span>
                                    <span className="font-bold text-lg text-primary">₹{orderDetails.payableAmount}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsPage;
