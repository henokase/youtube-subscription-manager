export default function TermsPage() {
    return (
        <div className="container mx-auto max-w-3xl px-4 py-12 text-zinc-300">
            <h1 className="mb-8 text-3xl font-bold text-white">Terms of Service</h1>

            <div className="space-y-6">
                <section>
                    <h2 className="mb-3 text-xl font-semibold text-white">1. Introduction</h2>
                    <p>
                        By using YouTube Subscription Manager, you agree to these terms. This application connects to your YouTube account to help you manage your subscriptions.
                    </p>
                </section>

                <section>
                    <h2 className="mb-3 text-xl font-semibold text-white">2. Usage</h2>
                    <p>
                        You are responsible for your account activity. This tool allows you to bulk unsubscribe from channels. Please use this feature carefully, as actions cannot be undone.
                    </p>
                </section>

                <section>
                    <h2 className="mb-3 text-xl font-semibold text-white">3. YouTube API</h2>
                    <p>
                        This application uses the YouTube Data API. By using it, you also agree to be bound by the <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:underline">YouTube Terms of Service</a> and <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:underline">Google Privacy Policy</a>.
                    </p>
                </section>

                <section>
                    <h2 className="mb-3 text-xl font-semibold text-white">4. Disclaimer</h2>
                    <p>
                        The application is provided "as is" without warranties of any kind. We are not liable for any data loss or issues arising from the use of this service.
                    </p>
                </section>
            </div>
        </div>
    );
}
