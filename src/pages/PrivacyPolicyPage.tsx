import { Helmet } from 'react-helmet-async';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CartBar } from '@/components/CartBar';
import { CartDrawer } from '@/components/CartDrawer';
import { CONTACT_INFO } from '@/lib/constants';
import { ReactNode } from 'react';

const PRIVACY_SECTIONS: { title: string; content: ReactNode }[] = [
    {
        title: "1. Information We Collect",
        content: "We collect customer name, email address, phone number, and shipping address for order fulfillment, account creation, and payment processing purposes. When you browse our store, we also automatically receive your computer’s internet protocol (IP) address to provide us with information that helps us learn about your browser and operating system."
    },
    {
        title: "2. Payment Data Handling",
        content: "Payment details are processed securely through our payment gateway partner (Razorpay). We do not store your complete credit card information or UPI credentials on our servers. Your purchase transaction data is stored only as long as is necessary to complete your purchase transaction."
    },
    {
        title: "3. Use of Cookies",
        content: "We use cookies to maintain your session on our website, keep track of items in your cart, and understand how you interact with our platform to improve your experience. You can choose to disable cookies through your browser settings, but this may affect your ability to use certain features of our website."
    },
    {
        title: "4. Data Sharing and Disclosure",
        content: "We may share your personal information with third-party service providers (like shipping partners and payment gateways) strictly to the extent necessary to allow them to perform the services they provide to us. We do not sell or rent your personal information to third parties."
    },
    {
        title: "5. Contact Us",
        content: <>For more information about our privacy practices, if you have questions, or if you would like to make a complaint, please contact us by e-mail at {CONTACT_INFO.EMAIL} or by mail at {CONTACT_INFO.ADDRESS}.</>
    }
];

const PrivacyPolicyPage = () => {
    return (
        <>
            <Helmet>
                <title>Privacy Policy – Aurabites Makhana Snacks</title>
                <meta name="description" content="Privacy Policy for Aurabites." />
            </Helmet>

            <div className="min-h-screen bg-background">
                <Navbar />

                <main className="pt-24 pb-32 md:pb-16 max-w-4xl mx-auto px-4">
                    <section className="py-16">
                        <h1 className="font-display text-4xl font-extrabold text-foreground mb-8">
                            Privacy Policy
                        </h1>

                        <div className="prose prose-sm md:prose-base text-muted-foreground max-w-none">
                            <p className="mb-4">
                                Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </p>

                            {PRIVACY_SECTIONS.map((section, index) => (
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

export default PrivacyPolicyPage;
