import Link from "next/link";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Layout, Trash2, Shield } from "lucide-react";

export default async function Home() {
  const session = await auth();

  return (
    <div className="flex min-h-[calc(100vh-80px)] flex-col">
      {/* Hero Section */}
      <section className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center sm:py-32">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="mx-auto w-fit rounded-full bg-red-500/10 px-4 py-1.5 text-sm font-medium text-red-400 ring-1 ring-inset ring-red-500/20">
            Take back control of your feed
          </div>
          <h1 className="bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-6xl">
            UnsubTube: YouTube Subscription Manager
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-zinc-400">
            Effortlessly manage your YouTube channels. Bulk unsubscribe, filter by name, and export your data — all from a clean, modern dashboard.
          </p>
          <div className="flex items-center justify-center gap-4 pt-4">
            {session ? (
              <Link href="/dashboard">
                <Button size="lg" className="h-12 gap-2 text-base">
                  Go to Dashboard <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button size="lg" className="h-12 gap-2 text-base bg-red-600 hover:bg-red-700 text-white border-0">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            )}
            <Link href="https://github.com/henokase/youtube-subscription-manager" target="_blank">
              <Button variant="outline" size="lg" className="h-12 text-base bg-transparent border-zinc-700 hover:bg-zinc-800 text-zinc-300">
                View Source
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      {/* <section className="container mx-auto px-4 py-16 sm:py-24">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={<UnsubscribeIcon />}
            title="Bulk Action Power"
            description="Select multiple channels and unsubscribe from them all at once. No more clicking one by one."
          />
          <FeatureCard
            icon={<Layout className="h-6 w-6 text-blue-400" />}
            title="Smart Filtering"
            description="Instantly search through thousands of subscriptions to find exactly what you're looking for."
          />
          <FeatureCard
            icon={<Shield className="h-6 w-6 text-green-400" />}
            title="Secure & Private"
            description="We only access what's needed. Authenticated securely via Google. Your data stays in your browser."
          />
        </div>
      </section> */}
    </div>
  );
}

// function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
//   return (
//     <div className="group rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 transition-colors hover:bg-zinc-900">
//       <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-800 ring-1 ring-inset ring-zinc-700 transition-colors group-hover:bg-zinc-800/80">
//         {icon}
//       </div>
//       <h3 className="mb-2 text-xl font-semibold text-white">{title}</h3>
//       <p className="text-zinc-400">{description}</p>
//     </div>
//   );
// }

// function UnsubscribeIcon() {
//   return (
//     <svg
//       className="h-6 w-6 text-red-500"
//       fill="none"
//       viewBox="0 0 24 24"
//       stroke="currentColor"
//       strokeWidth={2}
//     >
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
//       />
//     </svg>
//   );
// }
