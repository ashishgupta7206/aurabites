import { Helmet } from 'react-helmet-async';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CartBar } from '@/components/CartBar';
import { CartDrawer } from '@/components/CartDrawer';
import { CONTACT_INFO } from '@/lib/constants';
import { ReactNode } from 'react';

const SHIPPING_SECTIONS: { title: string; content: ReactNode }[] = [
    {
        title: "1. Shipping Partners",
        content: "We partner with reliable courier services like Shiprocket, Delhivery, and Bluedart to ensure your order reaches you safely and on time."
    },
    {
        title: "2. Delivery Timeline",
        content: "All orders are typically processed and shipped out from our warehouse within 24-48 hours. Depending on your location, you can expect delivery within 3-7 business days from the date of dispatch."
    },
    {
        title: "3. Serviceable Areas",
        content: "Currently, we ship all across India. If our courier partners are unable to deliver to your specific pincode, we will notify you and process a full refund."
    },
    {
        title: "4. Delay Handling",
        content: "While we strive to ensure timely delivery, unexpected delays may occur due to weather conditions, transport strikes, or other logistical issues. If your order is significantly delayed, we will coordinate with the courier partner and keep you updated."
    },
    {
        title: "5. Shipment Issues",
        content: <>If you have any issues with your shipment, such as receiving a damaged package, or if the tracking shows delivered but you haven't received it, please contact us immediately at {CONTACT_INFO.EMAIL} or {CONTACT_INFO.PHONE}.</>
    }
];

const ShippingPolicyPage = () => {
    return (
        <>
            <Helmet>
                <title>Shipping & Delivery Policy – Aurabites Makhana Snacks</title>
                <meta name="description" content="Shipping and Delivery Policy for Aurabites." />
            </Helmet>

            <div className="min-h-screen bg-background">
                <Navbar />

                <main className="pt-24 pb-32 md:pb-16 max-w-4xl mx-auto px-4">
                    <section className="py-16">
                        <h1 className="font-display text-4xl font-extrabold text-foreground mb-8">
                            Shipping & Delivery Policy
                        </h1>

                        <div className="prose prose-sm md:prose-base text-muted-foreground max-w-none">
                            <p className="mb-4">
                                Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </p>

                            {SHIPPING_SECTIONS.map((section, index) => (
                                <div key={index}>
                                    <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">{section.title}</h2>
                                    <p className="mb-4">
                                        {section.content}
                                    </p>
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

export default ShippingPolicyPage;
