export default function PoliciesPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 p-8 pt-24 font-sans">
            <div className="max-w-4xl mx-auto space-y-12">
                <header className="border-b border-neutral-200 dark:border-neutral-800 pb-8">
                    <h1 className="text-4xl font-bold mb-4">Legal Policies</h1>
                    <p className="text-neutral-500 dark:text-neutral-400">Last updated: {new Date().toLocaleDateString()}</p>
                </header>

                <section id="privacy-policy" className="space-y-4">
                    <h2 className="text-2xl font-semibold">Privacy Policy</h2>
                    <p className="leading-relaxed">
                        At Form.aro, we take your privacy seriously. We collect minimal data necessary to provide our services,
                        including email and name for authentication, and form data you generate. We do not sell your data to third parties.
                        Data is stored on mongodb atlas and currency we're on free tier.
                    </p>
                </section>

                <section id="terms-conditions" className="space-y-4">
                    <h2 className="text-2xl font-semibold">Terms & Conditions</h2>
                    <p className="leading-relaxed">
                        By using Form.aro, you agree to not use the service for illegal activities or spam.
                        Users are responsible for the content of the forms they create. We reserve the right to ban users who violate these terms.
                        The service is provided "as is" without guarantees of uptime, though we strive for high availability.
                    </p>
                </section>

                <section id="refund-policy" className="space-y-4">
                    <h2 className="text-2xl font-semibold">Refund & Cancellation Policy</h2>
                    <div className="leading-relaxed">
                        Form.aro offers digital credits for AI form generation. Due to the nature of digital goods:
                        <br /><br />
                        <ul className="list-disc ml-6 space-y-2">
                            <li><strong>No Refunds:</strong> Once credits are purchased and added to your account, we generally do not offer refunds.</li>
                            <li><strong>Cancellations:</strong> You can stop using the service at any time. There are no recurring subscriptions to cancel (Pay-as-you-go model).</li>
                            <li><strong>Exceptions:</strong> If a technical error prevented you from receiving usage credits after payment, please contact us immediately for a resolution or refund.</li>
                        </ul>
                    </div>
                </section>

                <section id="contact-us" className="space-y-4">
                    <h2 className="text-2xl font-semibold">Contact Us</h2>
                    <p className="leading-relaxed">
                        If you have any questions about these policies, please contact us at:
                        <br />
                        <strong>Email:</strong> annshulch2@gmail.com
                        <br />
                    </p>
                </section>
            </div>
        </div>
    )
}
