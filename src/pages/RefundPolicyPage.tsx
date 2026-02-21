import { Helmet } from 'react-helmet-async';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CartBar } from '@/components/CartBar';
import { CartDrawer } from '@/components/CartDrawer';
import { CONTACT_INFO } from '@/lib/constants';
import { ReactNode } from 'react';

const REFUND_SECTIONS: { title: string; content: ReactNode }[] = [
    {
        title: "1. Refund Eligibility",
        content: "Due to the perishable nature of our products (makhana snacks), we generally do not accept returns. However, if you receive a product that is damaged, defective, or incorrect, you are eligible for a replacement or a full refund."
    },
    {
        title: "2. Refund Timeline",
        content: "Once your refund request is approved, refunds will be processed within 5-7 working days. The amount will be credited back to your original payment method."
    },
    {
        title: "3. Cancellation Conditions",
        content: "You may cancel your order before it has been dispatched from our warehouse. If the order has already been shipped, it cannot be cancelled."
    },
    {
        title: "4. Non-Refundable Cases",
        content: "Refunds will not be provided in the following cases: (a) If the product is damaged due to mishandling by the customer. (b) If the customer does not like the taste of the product (as taste is subjective). (c) If the delivery is delayed due to incorrect address provided by the customer."
    },
    {
        title: "5. How to Request a Refund or Cancellation",
        content: <>To request a refund, please contact our support team at {CONTACT_INFO.EMAIL} or call us at {CONTACT_INFO.PHONE} within 48 hours of receiving your order. Please include photos of the damaged or defective product.</>
    }
];

const RefundPolicyPage = () => {
    return (
        <>
            <Helmet>
                <title>Refund & Cancellation Policy – Aurabites Makhana Snacks</title>
                <meta name="description" content="Refund and Cancellation Policy for Aurabites." />
            </Helmet>

            <div className="min-h-screen bg-background">
                <Navbar />

                <main className="pt-24 pb-32 md:pb-16 max-w-4xl mx-auto px-4">
                    <section className="py-16">
                        <h1 className="font-display text-4xl font-extrabold text-foreground mb-8">
                            Refund & Cancellation Policy
                        </h1>

                        <div className="prose prose-sm md:prose-base text-muted-foreground max-w-none">
                            <p className="mb-4">
                                Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </p>

                            {REFUND_SECTIONS.map((section, index) => (
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

export default RefundPolicyPage;
