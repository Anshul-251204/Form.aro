import Link from "next/link"

export function Footer() {
    return (
        <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 py-8 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    © {new Date().getFullYear()} Form.aro. All rights reserved.
                </p>
                <div className="flex gap-6 text-sm">
                    <Link href="/policies" className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
                        Privacy Policy
                    </Link>
                    <Link href="/policies" className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
                        Terms of Service
                    </Link>
                    <Link href="/policies" className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
                        Refund Policy
                    </Link>
                </div>
            </div>
        </footer>
    )
}
