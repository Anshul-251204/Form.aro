import Link from "next/link"
import { Github, Twitter } from "lucide-react"
import TextLogo from "./TextLogo";

export function Footer() {
    return (
        <footer className="bg-white dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <div className="h-8 w-8 bg-linear-to-r from-blue-500  via-blue-800 to-blue-900 shadow-2xl  rounded-lg flex items-center justify-center text-white font-bold">
                                F                            
                             </div>
                            <TextLogo />
                        </Link>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            The open-source form builder for developers. Self-hostable, customizable, and free.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-neutral-900 dark:text-white mb-4">Product</h3>
                        <ul className="space-y-2 text-sm text-neutral-500 dark:text-neutral-400">
                            <li><Link href="/#features" className="hover:text-blue-600 dark:hover:text-blue-400">Features</Link></li>
                            <li><Link href="/docs/self-host" className="hover:text-blue-600 dark:hover:text-blue-400">Self-Hosting</Link></li>
                            <li><Link href="/dashboard" className="hover:text-blue-600 dark:hover:text-blue-400">Dashboard</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-neutral-900 dark:text-white mb-4">Resources</h3>
                        <ul className="space-y-2 text-sm text-neutral-500 dark:text-neutral-400">
                            <li><Link href="/docs/self-host" className="hover:text-blue-600 dark:hover:text-blue-400">Documentation</Link></li>
                            <li><a href="https://github.com/yourusername/Form.aro" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-blue-400">GitHub</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-neutral-900 dark:text-white mb-4">Connect</h3>
                        <div className="flex space-x-4">
                            <a href="https://github.com/yourusername/Form.aro" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white">
                                <Github className="h-5 w-5" />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white">
                                <Twitter className="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-800 text-center text-sm text-neutral-500 dark:text-neutral-400">
                    &copy; {new Date().getFullYear()} Form.aro. Open Source under MIT License.
                </div>
            </div>
        </footer>
    )
}
