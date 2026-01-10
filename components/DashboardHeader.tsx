"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Layout, LogOut, Plus, Settings, User, Zap } from "lucide-react"
import FormAroLogo from "@/components/TextLogo"
import { useState, useEffect } from "react"
import { PricingModal } from "./PricingModal"

export function DashboardHeader() {
    const { data: session } = useSession()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isPricingOpen, setIsPricingOpen] = useState(false)
    const [credits, setCredits] = useState<{ count: number; limit: number } | null>(null)

    const fetchCredits = async () => {
        try {
            const res = await fetch("/api/user/credits")
            if (res.ok) {
                const data = await res.json()
                setCredits(data)
            }
        } catch (error) {
            console.error("Failed to fetch credits", error)
        }
    }

    useEffect(() => {
        if (session?.user) {
            fetchCredits()
            // Optional: Poll every 30 seconds to keep updated with background usage
            const interval = setInterval(fetchCredits, 30000)
            return () => clearInterval(interval)
        }
    }, [session])

    // Update credits when modal closes (potentially after purchase)
    useEffect(() => {
        if (!isPricingOpen) {
            fetchCredits()
        }
    }, [isPricingOpen])

    return (
        <header className="sticky top-0 z-50 w-full border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <div className="flex items-center gap-4 sm:gap-8">

                    <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                            F
                        </div>
                        <span className="font-bold text-xl text-neutral-900 dark:text-white hidden sm:inline-block">
                            <FormAroLogo />
                        </span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-6">
                        {/* <Link
                            href="/dashboard"
                            className="text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
                        >
                            Forms
                        </Link> */}
                        <div className="flex flex-col items-end mr-2">
                            <div className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                                {credits ? credits.limit - credits.count : (session?.user?.aiDetails?.limit ? session.user.aiDetails.limit - (session.user.aiDetails.count || 0) : 0)} Credits Left
                            </div>
                            <div className="text-[10px] text-neutral-500 dark:text-neutral-400">
                                {credits ? credits.count : (session?.user?.aiDetails?.count || 0)} / {credits ? credits.limit : (session?.user?.aiDetails?.limit || 3)} used
                            </div>
                        </div>

                        <button
                            onClick={() => setIsPricingOpen(true)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:hover:bg-amber-900/50 rounded-full text-xs font-semibold transition-colors"
                        >
                            <Zap className="h-3.5 w-3.5 fill-current" />
                            <span>Upgrade</span>
                        </button>
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    {/* Mobile Create Button - Icon Only */}
                    <Link
                        href="/builder"
                        className="flex sm:hidden items-center justify-center h-9 w-9 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="h-5 w-5" />
                    </Link>

                    <div className="relative">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="flex items-center gap-2 p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        >
                            <div className="h-8 w-8 bg-neutral-200 dark:bg-neutral-800 rounded-full flex items-center justify-center text-neutral-600 dark:text-neutral-400 font-medium">
                                {session?.user?.image ? <img src={session?.user?.image} alt="User" className="h-8 w-8 rounded-full" /> : session?.user?.email?.[0].toUpperCase() || <User className="h-4 w-4" />}
                            </div>
                        </button>

                        {isMenuOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setIsMenuOpen(false)}
                                />
                                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-neutral-900 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-800 py-1 overflow-hidden z-50">
                                    <div className="px-4 py-3 border-b border-neutral-100 dark:border-neutral-800">
                                        <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                                            {session?.user?.email}
                                        </p>
                                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                                            {session?.user?.aiDetails?.limit ? session.user.aiDetails.limit - (session.user.aiDetails.count || 0) : 0} Credits Left
                                        </p>
                                    </div>

                                    {/* Mobile Links in Dropdown */}
                                    <div className="md:hidden p-1 border-b border-neutral-100 dark:border-neutral-800">
                                        <Link
                                            href="/dashboard"
                                            className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <Layout className="h-4 w-4" />
                                            Dashboard
                                        </Link>
                                        <button
                                            onClick={() => {
                                                setIsMenuOpen(false);
                                                setIsPricingOpen(true);
                                            }}
                                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                                        >
                                            <Zap className="h-4 w-4" />
                                            Upgrade Plan
                                        </button>
                                    </div>

                                    {/* <div className="p-1">
                                        <Link
                                            href="/dashboard/settings"
                                            className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <Settings className="h-4 w-4" />
                                            Settings
                                        </Link>
                                    </div> */}
                                    <div className="p-1 border-t border-neutral-100 dark:border-neutral-800">
                                        <button
                                            onClick={() => signOut({ callbackUrl: "/" })}
                                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            Sign out
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <PricingModal isOpen={isPricingOpen} onClose={() => setIsPricingOpen(false)} />
        </header>
    )
}
