"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Mail, Lock, Loader2, AlertCircle, Eye, EyeOff, LogIn } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function LoginForm() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const router = useRouter()
    const { showToast } = useToast()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        try {
            console.log("Attempting sign in...")
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
            })
            console.log("Sign in resp:", res)

            if (res?.error) {
                const errorMessage = "Invalid credentials"
                setError(errorMessage)
                showToast(errorMessage, "error")
            } else {
                console.log("Success! Redirecting...")
                showToast("Signed in successfully", "success")
                // Use window.location.href to force a full page reload and ensure the session cookie is recognized
                window.location.href = "/dashboard"
            }
        } catch (error) {
            console.error("Sign in error:", error)
            setError("Something went wrong. Please try again.")
            showToast("Something went wrong", "error")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 flex flex-col items-center justify-center p-4">
            <div className="bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow-lg border border-neutral-200 dark:border-neutral-800 w-full max-w-md">
                <div className="mb-8 text-center">
                    <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <LogIn className="h-6 w-6" />
                    </div>
                    <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">Welcome Back</h1>
                    <p className="text-neutral-500 dark:text-neutral-400">Sign in to your account</p>
                </div>

                {error && (
                    <div className="mb-6 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-3 rounded-lg flex items-center gap-2 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Email address</label>
                        <div className="relative">
                            <input
                                type="email"
                                required
                                className="w-full pl-10 pr-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <Mail className="absolute left-3 top-2.5 h-5 w-5 text-neutral-400" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                className="w-full pl-10 pr-10 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <Lock className="absolute left-3 top-2.5 h-5 w-5 text-neutral-400" />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-2.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sign In"}
                        </button>
                    </div>
                </form>

                <div className="mt-8 pt-6 border-t border-neutral-100 dark:border-neutral-800 text-center text-sm text-neutral-500 dark:text-neutral-400">
                    Don&apos;t have an account?{" "}
                    <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
                        Create account
                    </Link>
                </div>
            </div>
        </div>
    )
}
