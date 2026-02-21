import { Helmet } from 'react-helmet-async';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CartBar } from '@/components/CartBar';
import { CartDrawer } from '@/components/CartDrawer';
import { CONTACT_INFO } from '@/lib/constants';
import { ReactNode } from 'react';

const TERMS_SECTIONS: { title: string; content: ReactNode }[] = [
    {
        title: "1. Introduction",
        content: "Welcome to Aurabites. By accessing our website and purchasing our products, you agree to be bound by these Terms and Conditions. Please read them carefully."
    },
    {
        title: "2. Products and Pricing",
        content: "All products are subject to availability. We reserve the right to modify or discontinue any product without notice. Prices for our products are subject to change without notice. We shall not be liable to you or any third-party for any modification, price change, suspension, or discontinuance of the service or product."
    },
    {
        title: "3. Shipping and Delivery",
        content: "Shipping times may vary depending on your location. Once an order is processed, we cannot guarantee specific delivery times. Any delays caused by the courier service are beyond our control."
    },
    {
        title: "4. Returns and Refunds",
        content: "Due to the nature of our products, we typically do not accept returns. If you receive a damaged or incorrect product, please contact our customer support within 48 hours of delivery for a replacement or refund."
    },
    {
        title: "5. Limitation of Liability",
        content: "Aurabites and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to, loss of profits, data, use, goodwill, or other intangible losses resulting from your access to or use of our services."
    },
    {
        title: "6. Changes to Terms",
        content: "We reserve the right, at our sole discretion, to update, change, or replace any part of these Terms and Conditions by posting updates and changes to our website. It is your responsibility to check our website periodically for changes."
    },
    {
        title: "7. Contact Information",
        content: <>Questions about the Terms and Conditions should be sent to us at {CONTACT_INFO.EMAIL} or by calling us at {CONTACT_INFO.PHONE}.</>
    }
];

const TermsPage = () => {
    return (
        <>
            <Helmet>
                <title>Terms & Conditions – Aurabites Makhana Snacks</title>
                <meta name="description" content="Terms and Conditions for Aurabites." />
            </Helmet>

            <div className="min-h-screen bg-background">
                <Navbar />

                <main className="pt-24 pb-32 md:pb-16 max-w-4xl mx-auto px-4">
                    <section className="py-16">
                        <h1 className="font-display text-4xl font-extrabold text-foreground mb-8">
                            Terms & Conditions
                        </h1>

                        <div className="prose prose-sm md:prose-base text-muted-foreground max-w-none">
                            <p className="mb-4">
                                Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </p>

                            {TERMS_SECTIONS.map((section, index) => (
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

export default TermsPage;
