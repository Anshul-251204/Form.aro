import Link from "next/link"
import { ArrowRight, BarChart3, Code2, Layout, Lock, Server, Zap, Sparkles, Wand2, Bot } from "lucide-react"
import { Footer } from "@/components/Footer"
import FormAroLogo from "@/components/TextLogo"
import { Hero } from "@/components/Hero"

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"
import { redirect } from "next/navigation"

export default async function LandingPage() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              F
            </div>


            <span className="font-bold text-xl text-neutral-900 dark:text-white"><FormAroLogo /> </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/docs/self-host"
              className="text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hidden sm:block"
            >
              Self-Host
            </Link>
            <Link
              href="/dashboard"
              className="text-sm font-medium bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">

        <Hero />
      </section>

      {/* AI Features Highlight */}
      <section className="py-20 bg-linear-to-b from-purple-50 to-white dark:from-purple-900/10 dark:to-neutral-950 border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4" />
              <span>New: AI Power</span>
            </div>
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">Build Faster with Artificial Intelligence</h2>
            <p className="text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto">
              Skip the manual work. Let our advanced AI generate comprehensive forms, surveys, and quizzes from a simple description.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 relative overflow-hidden group hover:border-purple-500/50 transition-colors">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Bot className="h-32 w-32 text-purple-600" />
              </div>
              <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-6 text-purple-600 dark:text-purple-400">
                <Bot className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">Text to Form</h3>
              <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">
                "Create a customer feedback survey." Just type your idea, and watch the AI build a complete form with relevant fields, validations, and logic in seconds.
              </p>
            </div>

            <div className="bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 relative overflow-hidden group hover:border-pink-500/50 transition-colors">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Wand2 className="h-32 w-32 text-pink-600" />
              </div>
              <div className="h-12 w-12 bg-pink-100 dark:bg-pink-900/30 rounded-xl flex items-center justify-center mb-6 text-pink-600 dark:text-pink-400">
                <Wand2 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">Smart Refinement</h3>
              <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Already have a form? The AI can analyze it and suggest missing questions, better option lists, or improved structure to maximize completion rates.
              </p>
            </div>

            <div className="bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 relative overflow-hidden group hover:border-blue-500/50 transition-colors">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Sparkles className="h-32 w-32 text-blue-600" />
              </div>
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">One-Click Polish</h3>
              <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Instantly fix typos, standardize labels, and ensure your form looks professional with a single click of the "Improve" button.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-neutral-50 dark:bg-neutral-900/50 border-y border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">Everything you need</h2>
            <p className="text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto">
              Powerful features for developers and teams. Simple enough for anyone to use.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Layout className="h-6 w-6 text-blue-600" />}
              title="Drag & Drop Builder"
              description="Create complex forms in minutes with our intuitive drag-and-drop interface. No coding required."
            />
            <FeatureCard
              icon={<BarChart3 className="h-6 w-6 text-purple-600" />}
              title="Real-time Analytics"
              description="Track views, completion rates, and submissions in real-time. Export data to CSV with one click."
            />
            <FeatureCard
              icon={<Server className="h-6 w-6 text-green-600" />}
              title="Self-Hostable"
              description="Run Form.aro on your own infrastructure using Docker. Keep full control over your data."
            />
            <FeatureCard
              icon={<Zap className="h-6 w-6 text-yellow-600" />}
              title="Instant Publish"
              description="Publish your forms instantly and share them with a unique URL. No deployment steps needed."
            />
            <FeatureCard
              icon={<Lock className="h-6 w-6 text-red-600" />}
              title="Secure & Private"
              description="Built with privacy in mind. Your data stays in your database. We don't track your users."
            />
            <FeatureCard
              icon={<Code2 className="h-6 w-6 text-indigo-600" />}
              title="Developer Friendly"
              description="Built with Next.js, Tailwind, and MongoDB. Easy to extend and customize."
            />
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">How it works</h2>
            <p className="text-neutral-500 dark:text-neutral-400">From idea to data in three simple steps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <Step
              number="01"
              title="Build"
              description="Drag and drop fields to create your perfect form. Customize labels, validation, and layout."
            />
            <Step
              number="02"
              title="Publish"
              description="Click publish to get a shareable link. Your form is instantly live and ready to collect data."
            />
            <Step
              number="03"
              title="Analyze"
              description="View submissions and analytics in your dashboard. Export data for further analysis."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-neutral-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to take control of your forms?</h2>
          <p className="text-neutral-400 text-lg mb-8">
            Join thousands of developers who are building better forms with Form.aro.
            Open source, free to start, and easy to scale.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Get Started for Free
            </Link>
            <Link
              href="/docs/self-host"
              className="w-full sm:w-auto px-8 py-3 border border-neutral-700 text-white rounded-lg font-medium hover:bg-neutral-800 transition-colors"
            >
              Read the Docs
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-6 bg-white dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-blue-500/50 transition-colors">
      <div className="h-12 w-12 bg-neutral-50 dark:bg-neutral-900 rounded-lg flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">{title}</h3>
      <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">
        {description}
      </p>
    </div>
  )
}

function Step({ number, title, description }: { number: string, title: string, description: string }) {
  return (
    <div className="text-center">
      <div className="text-6xl font-bold text-neutral-100 dark:text-neutral-900 mb-4">{number}</div>
      <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">{title}</h3>
      <p className="text-neutral-500 dark:text-neutral-400">
        {description}
      </p>
    </div>
  )
}
