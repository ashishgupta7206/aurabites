import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Package, ChevronRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import { format } from "date-fns";

const OrderHistoryPage = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const baseUrl = import.meta.env?.VITE_API_BASE_URL;
                const token = Cookies.get("token");
                if (!token) {
                    setLoading(false);
                    return;
                }
                const res = await fetch(`${baseUrl}/orders/my`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await res.json();
                if (data?.success) {
                    setOrders(data.data);
                }
            } catch (err) {
                console.error("Failed to fetch order history", err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    // Helper to extract the first image or return a fallback
    // const getOrderImage = (order: any) => {
    //     if (order.items && order.items.length > 0 && order.items[0].variantImage) {
    //         return order.items[0].variantImage;
    //     }
    //     return undefined; // fallback handled by CSS if needed
    // };
    const token = Cookies.get("token");
    const navigate = useNavigate();
    if (!token) {
        navigate("/login");

    }

    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <div className="container mx-auto px-4 max-w-4xl mb-8">
                <Link to="/">
                    <Button className="rounded-full px-8 py-6">
                        Back to Home
                    </Button>
                </Link>
            </div>
            <Helmet>
                <title>My Orders – Aurabites</title>
            </Helmet>

            <div className="container mx-auto px-4 max-w-4xl">
                <div className="flex items-center gap-3 mb-8">
                    <Package className="w-8 h-8 text-primary" />
                    <h1 className="font-display text-3xl font-bold text-foreground">
                        My Orders
                    </h1>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="bg-card border border-border rounded-xl p-12 text-center space-y-4">
                        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                            <Package className="w-10 h-10 text-muted-foreground" />
                        </div>
                        <h2 className="text-xl font-semibold text-foreground">No orders yet</h2>
                        <p className="text-muted-foreground max-w-md mx-auto">
                            Looks like you haven't made your first purchase yet. Explore our selection of delicious and healthy makhana snacks!
                        </p>
                        <div className="pt-4">
                            <Link to="/shop">
                                <Button className="rounded-full px-8 py-6">
                                    Start Shopping
                                </Button>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => {
                            // const firstImage = getOrderImage(order);
                            return (
                                <Link
                                    key={order.id}
                                    to={`/orders/${order.id}`}
                                    className="block bg-card border border-border rounded-xl p-4 sm:p-6 hover:shadow-md transition-shadow group relative overflow-hidden"
                                >
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block">
                                        <ChevronRight className="w-6 h-6 text-primary" />
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-6">
                                        <div className="flex items-center justify-between sm:hidden border-b border-border pb-4 mb-4">
                                            <span className="font-semibold text-sm">Order #{order.id}</span>
                                            <span className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${order.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                                {order.status?.toLowerCase()}
                                            </span>
                                        </div>

                                        {/* {firstImage ? (
                                            <div className="w-full sm:w-24 h-24 bg-muted rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                                                <img src={firstImage} alt="Order item" className="w-full h-full object-contain mix-blend-multiply p-2" />
                                            </div>
                                        ) : (
                                            <div className="w-full sm:w-24 h-24 bg-muted rounded-lg flex items-center justify-center shrink-0">
                                                <Package className="w-8 h-8 text-muted-foreground" />
                                            </div>
                                        )} */}

                                        <div className="flex-1 space-y-3">
                                            <div className="hidden sm:flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-semibold text-lg hover:text-primary transition-colors">
                                                        Order #{order.id}
                                                    </h3>
                                                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                                                        <Clock className="w-4 h-4 mr-1.5" />
                                                        {order.orderDate ? format(new Date(order.orderDate), "MMM dd, yyyy 'at' h:mm a") : 'Unknown date'}
                                                    </div>
                                                </div>
                                                <span className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${order.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                                    {order.status?.toLowerCase()}
                                                </span>
                                            </div>

                                            {/* Mobile view date */}
                                            <div className="flex sm:hidden items-center text-xs text-muted-foreground">
                                                <Clock className="w-3 h-3 mr-1" />
                                                {order.orderDate ? format(new Date(order.orderDate), "MMM dd, yyyy") : 'Unknown date'}
                                            </div>

                                            <div className="text-sm text-muted-foreground ">
                                                {order.items?.map((item: any) => `${item.quantity}x ${item.productVariantName}`).join(', ')}
                                            </div>

                                            <div className="flex items-center gap-4 pt-2">
                                                <div>
                                                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Total Amount</p>
                                                    <p className="font-medium text-foreground">₹{order.payableAmount}</p>
                                                </div>
                                                <div className="hidden sm:block">
                                                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Items</p>
                                                    <p className="font-medium text-foreground">{order.items?.length || 0}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4 sm:hidden flex justify-end">
                                        <span className="text-primary text-sm font-medium flex items-center">View Details <ChevronRight className="w-4 h-4 ml-1" /></span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderHistoryPage;
