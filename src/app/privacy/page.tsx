export default function PrivacyPage() {
    return (
        <div className="container mx-auto max-w-3xl px-4 py-12 text-zinc-300">
            <h1 className="mb-8 text-3xl font-bold text-white">Privacy Policy</h1>

            <div className="space-y-6">
                <section>
                    <h2 className="mb-3 text-xl font-semibold text-white">1. Data Collection</h2>
                    <p>
                        We only access the data absolutely necessary for the application to function: your Google profile (for authentication) and your YouTube subscriptions (to display and manage them).
                    </p>
                </section>

                <section>
                    <h2 className="mb-3 text-xl font-semibold text-white">2. Data Usage</h2>
                    <p>
                        Your data is used solely to provide the service. We do not sell, rent, or share your personal information with any third parties. All operations are performed directly between your browser and the YouTube API.
                    </p>
                </section>

                <section>
                    <h2 className="mb-3 text-xl font-semibold text-white">3. Data Storage</h2>
                    <p>
                        We do not store your subscription data on our servers. Authentication tokens are stored securely in your browser to maintain your session.
                    </p>
                </section>

                <section>
                    <h2 className="mb-3 text-xl font-semibold text-white">4. Revoking Access</h2>
                    <p>
                        You can revoke this application&apos;s access to your data at any time via your <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:underline">Google Security settings</a>.
                    </p>
                </section>
            </div>
        </div>
    );
}
