import { BarChart3, Database, Layout, Lock, MousePointer2, Zap } from "lucide-react"

const features = [
    {
        name: "Drag & Drop Builder",
        description: "Create complex forms in minutes with our intuitive visual editor. No coding required.",
        icon: MousePointer2,
    },
    {
        name: "Real-time Analytics",
        description: "Visualize responses instantly with beautiful charts and graphs. Export data with one click.",
        icon: BarChart3,
    },
    {
        name: "Self-Hostable",
        description: "Run the entire stack on your own servers using Docker. Keep full control of your infrastructure.",
        icon: Database,
    },
    {
        name: "Privacy First",
        description: "Your data belongs to you. We don't track your users or sell your data to third parties.",
        icon: Lock,
    },
    {
        name: "Lightning Fast",
        description: "Optimized for performance. Forms load instantly and submissions are processed in milliseconds.",
        icon: Zap,
    },
    {
        name: "Responsive Design",
        description: "Forms look great on any device - desktop, tablet, or mobile. Automatically adapted layouts.",
        icon: Layout,
    },
]

export function Features() {
    return (
        <section className="py-24 bg-neutral-50 dark:bg-neutral-900" id="features">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
                        Everything you need to build powerful forms
                    </h2>
                    <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
                        Form.aro combines the ease of use of SaaS with the control of self-hosting.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature) => (
                        <div key={feature.name} className="relative p-8 bg-white dark:bg-neutral-950 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md transition-shadow">
                            <div className="inline-flex items-center justify-center p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 mb-6">
                                <feature.icon className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-3">
                                {feature.name}
                            </h3>
                            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
