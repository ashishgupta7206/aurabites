import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { XCircle, RefreshCcw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";

const OrderFailedPage = () => {
    const [searchParams] = useSearchParams();
    const reason = searchParams.get("reason") || "Your payment could not be processed.";
    const orderId = searchParams.get("orderId");
    const [orderDetails, setOrderDetails] = useState<any>(null);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            if (!orderId) return;
            try {
                const baseUrl = import.meta.env?.VITE_API_BASE_URL;
                const token = Cookies.get("token");
                const res = await fetch(`${baseUrl}/orders/${orderId}`, {
                    headers: {
                        "Content-Type": "application/json",
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                });
                const data = await res.json();
                if (data?.success) {
                    setOrderDetails(data.data);
                }
            } catch (err) {
                console.error("Failed to fetch order details", err);
            }
        };

        fetchOrderDetails();
    }, [orderId]);

    return (
        <>
            <Helmet>
                <title>Payment Failed – Aurabites</title>
            </Helmet>

            <div className="min-h-screen bg-background flex items-center justify-center p-6">
                <div className="max-w-md w-full text-center space-y-6">
                    <div className="flex justify-center mb-8">
                        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
                            <XCircle className="w-12 h-12 text-red-600" />
                        </div>
                    </div>

                    <h1 className="font-display text-4xl font-bold text-foreground">
                        Payment Failed
                    </h1>

                    <p className="text-muted-foreground text-lg mb-8">
                        {reason}
                    </p>

                    {orderDetails ? (
                        <div className="bg-card border border-border rounded-xl p-6 mt-8 space-y-4 text-left">
                            <div className="flex justify-between border-b border-border pb-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Order ID</p>
                                    <p className="font-medium text-foreground">#{orderDetails.id}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-muted-foreground">Payment Amount</p>
                                    <p className="font-medium text-primary">₹{orderDetails.payableAmount}</p>
                                </div>
                            </div>

                            <div className="space-y-3 pt-2">
                                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Items</h3>
                                {orderDetails.items?.map((item: any, idx: number) => (
                                    <div key={idx} className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-3">
                                            {item.variantImage && (
                                                <div className="w-10 h-10 bg-muted rounded flex items-center justify-center overflow-hidden">
                                                    <img src={item.variantImage} alt="" className="max-w-full max-h-full object-contain mix-blend-multiply" />
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-medium max-w-[200px] truncate">{item.productVariantName || item.productName}</p>
                                                <p className="text-muted-foreground">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <p className="font-medium">₹{item.priceAtTime * item.quantity}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm mt-4">
                                Don't worry, any deducted amount will be refunded to your account within 3-5 business days.
                            </div>
                        </div>
                    ) : (
                        <div className="bg-card border border-border rounded-xl p-6 mt-8 space-y-4">
                            <p className="text-sm">Don't worry, any deducted amount will be refunded to your account within 3-5 business days.</p>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
                        <Link to="/checkout" className="w-full sm:w-auto">
                            <Button className="w-full sm:w-auto rounded-full py-6 px-8 text-base">
                                <RefreshCcw className="w-5 h-5 mr-2" />
                                Try Again
                            </Button>
                        </Link>
                        <Link to="/" className="w-full sm:w-auto">
                            <Button variant="outline" className="w-full sm:w-auto rounded-full py-6 px-8 text-base border-border hover:bg-secondary">
                                <ArrowLeft className="w-5 h-5 mr-2" />
                                Return Home
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OrderFailedPage;
