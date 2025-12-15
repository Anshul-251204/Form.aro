import Link from "next/link"
import { ArrowLeft, Terminal, Copy, Check } from "lucide-react"
import { Footer } from "@/components/Footer"

export default function SelfHostPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-neutral-950">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                                F
                            </div>
                            <span className="font-bold text-xl text-neutral-900 dark:text-white">Form.aro</span>
                        </Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link
                            href="/dashboard"
                            className="text-sm font-medium bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                        >
                            Go to Dashboard
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <Link href="/" className="inline-flex items-center text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white mb-8">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Home
                    </Link>

                    <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-6">Self-Hosting Guide</h1>
                    <p className="text-lg text-neutral-500 dark:text-neutral-400 mb-12">
                        Form.aro is designed to be easy to self-host. You can run the entire stack (App + Database) on your own infrastructure using Docker.
                    </p>

                    <div className="space-y-12">
                        <Section title="Prerequisites">
                            <ul className="list-disc list-inside space-y-2 text-neutral-600 dark:text-neutral-400">
                                <li>Docker and Docker Compose installed on your machine.</li>
                                <li>Git (to clone the repository).</li>
                            </ul>
                        </Section>

                        <Section title="1. Clone the Repository">
                            <CodeBlock code="git clone https://github.com/yourusername/Form.aro.git\ncd Form.aro" />
                        </Section>

                        <Section title="2. Configure Environment">
                            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                                Create a <code className="bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded text-sm">.env.local</code> file in the root directory. You can copy the example file:
                            </p>
                            <CodeBlock code="cp .env.example .env.local" />
                            <p className="text-neutral-600 dark:text-neutral-400 mt-4 mb-4">
                                Update the variables in <code className="bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded text-sm">.env.local</code>. For Docker, the database URL should point to the mongo service:
                            </p>
                            <CodeBlock code="MONGODB_URI=mongodb://mongo:27017/Form.aro\nNEXTAUTH_SECRET=your-secret-key\nNEXTAUTH_URL=http://localhost:3000" />
                        </Section>

                        <Section title="3. Run with Docker Compose">
                            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                                Build and start the containers:
                            </p>
                            <CodeBlock code="docker-compose up -d" />
                            <p className="text-neutral-600 dark:text-neutral-400 mt-4">
                                The application will be available at <code className="bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded text-sm">http://localhost:3000</code>.
                            </p>
                        </Section>

                        <Section title="Updating">
                            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                                To update to the latest version:
                            </p>
                            <CodeBlock code="git pull\ndocker-compose up -d --build" />
                        </Section>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}

function Section({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <section>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">{title}</h2>
            {children}
        </section>
    )
}

function CodeBlock({ code }: { code: string }) {
    return (
        <div className="bg-neutral-900 rounded-lg p-4 overflow-x-auto">
            <pre className="font-mono text-sm text-neutral-300">
                {code}
            </pre>
        </div>
    )
}
