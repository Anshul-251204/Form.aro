import Link from "next/link"
import { ArrowRight, CheckCircle2, Shield, Database, LayoutTemplate } from "lucide-react"
import { cn } from "@/lib/utils"

export function Hero() {
    return (
        <div className="relative overflow-hidden bg-white dark:bg-neutral-950 pt-16 pb-32">
            {/* Background Gradients */}

            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
                <div className="absolute top-40 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-4xl mx-auto mb-16">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium mb-6 border border-blue-100 dark:border-blue-800">
                        <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2 animate-pulse"></span>
                        Now Open Source & Self-Hostable
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-neutral-900 dark:text-white mb-8">
                        The Google Forms Alternative <br />
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600">
                            You Actually Own
                        </span>
                    </h1>

                    <p className="text-xl text-neutral-600 dark:text-neutral-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Build beautiful forms, collect data securely, and host it on your own infrastructure.
                        No tracking, no data mining, just pure form building.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/dashboard">
                            <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium text-lg transition-all shadow-lg hover:shadow-blue-500/25 flex items-center gap-2">
                                Get Started Free <ArrowRight className="w-5 h-5" />
                            </button>
                        </Link>
                        <button className="px-8 py-4 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-800 rounded-full font-medium text-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all flex items-center gap-2">
                            <Database className="w-5 h-5 text-neutral-500" />
                            Self-Host Guide
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                    {/* Left: Builder UI Mockup */}
                    <div className="bg-white dark:bg-neutral-950 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-800 p-6">
                        <div className="flex items-center gap-2 mb-6 border-b border-neutral-100 dark:border-neutral-900 pb-4">
                            <div className="h-3 w-3 rounded-full bg-red-500" />
                            <div className="h-3 w-3 rounded-full bg-yellow-500" />
                            <div className="h-3 w-3 rounded-full bg-green-500" />
                        </div>
                        <div className="space-y-4">
                            <div className="h-8 w-3/4 bg-neutral-100 dark:bg-neutral-900 rounded" />
                            <div className="h-32 w-full bg-blue-50 dark:bg-blue-900/20 rounded border-2 border-dashed border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-500 text-sm">
                                Drag fields here
                            </div>
                            <div className="space-y-2">
                                <div className="h-10 w-full bg-neutral-100 dark:bg-neutral-900 rounded" />
                                <div className="h-10 w-full bg-neutral-100 dark:bg-neutral-900 rounded" />
                            </div>
                        </div>
                    </div>

                    {/* Right: Code/Terminal Visual */}
                    <div className="bg-neutral-900 rounded-xl shadow-lg border border-neutral-800 p-6 font-mono text-sm text-neutral-300 hidden md:block">
                        <div className="flex items-center justify-between mb-4 text-neutral-500">
                            <span>docker-compose.yml</span>
                            <div className="flex gap-1">
                                <div className="h-2 w-2 rounded-full bg-neutral-700" />
                                <div className="h-2 w-2 rounded-full bg-neutral-700" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p><span className="text-purple-400">services:</span></p>
                            <p className="pl-4"><span className="text-blue-400">Form.aro:</span></p>
                            <p className="pl-8"><span className="text-green-400">image:</span> Form.aro:latest</p>
                            <p className="pl-8"><span className="text-green-400">ports:</span></p>
                            <p className="pl-12">- "3000:3000"</p>
                            <p className="pl-8"><span className="text-green-400">environment:</span></p>
                            <p className="pl-12">- DATABASE_URL=...</p>
                            <p className="pl-4"><span className="text-blue-400">mongo:</span></p>
                            <p className="pl-8"><span className="text-green-400">image:</span> mongo:latest</p>
                        </div>
                    </div>
                </div>

                {/* Bento Grid Visual */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-8 mx-auto">
                    {/* Main Form Builder Preview */}
                    <div className="md:col-span-8 bg-neutral-50 dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-2 shadow-2xl overflow-hidden group">
                        <div className="bg-white dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800 h-full min-h-[400px] p-6 relative">
                            <div className="absolute top-0 left-0 w-full h-12 border-b border-neutral-100 dark:border-neutral-800 flex items-center px-4 gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-400/80" />
                                <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                                <div className="w-3 h-3 rounded-full bg-green-400/80" />
                            </div>
                            <div className="mt-12 space-y-4 opacity-50 group-hover:opacity-100 transition-opacity duration-500">
                                <div className="h-8 w-1/3 bg-neutral-100 dark:bg-neutral-800 rounded-lg" />
                                <div className="h-24 w-full bg-neutral-100 dark:bg-neutral-800 rounded-lg border-l-4 border-blue-500" />
                                <div className="h-12 w-2/3 bg-neutral-100 dark:bg-neutral-800 rounded-lg" />
                            </div>

                            {/* Floating Elements */}
                            <div className="absolute bottom-10 right-10 bg-white dark:bg-neutral-800 p-4 rounded-xl shadow-xl border border-neutral-100 dark:border-neutral-700 animate-bounce duration-[3000ms]">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                                        <CheckCircle2 className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-neutral-900 dark:text-white">New Submission</p>
                                        <p className="text-xs text-neutral-500">Just now</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Side Cards */}
                    <div className="md:col-span-4 space-y-6">
                        <div className="bg-neutral-900 text-white p-6 rounded-2xl h-[240px] flex flex-col justify-between relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <LayoutTemplate className="w-32 h-32" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">Drag & Drop</h3>
                                <p className="text-neutral-400 text-sm">Intuitive builder interface</p>
                            </div>
                            <div className="flex gap-2">
                                <div className="w-12 h-12 rounded-lg bg-neutral-800 border border-neutral-700" />
                                <div className="w-12 h-12 rounded-lg bg-neutral-800 border border-neutral-700" />
                                <div className="w-12 h-12 rounded-lg bg-blue-600 border border-blue-500" />
                            </div>
                        </div>

                        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 rounded-2xl h-[180px] flex flex-col justify-center">
                            <div className="font-mono text-sm text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-950 p-4 rounded-lg border border-neutral-200 dark:border-neutral-800">
                                <span className="text-blue-600">docker</span> run -d \<br />
                                &nbsp;&nbsp;-p 3000:3000 \<br />
                                &nbsp;&nbsp;Form.aro/core
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}



