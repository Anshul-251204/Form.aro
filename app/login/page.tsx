"use client"

import { useState, Suspense } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Mail, Lock, Loader2, AlertCircle, Eye, EyeOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

function LoginForm() {
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

        try {
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
            })
            console.log("res", res)
            if (res?.error) {
                let errorMessage = "Invalid credentials"

                if (res.code === "UserNotFound") {
                    errorMessage = "No account exists with this email"
                } else if (res.code === "InvalidPassword") {
                    errorMessage = "Incorrect password"
                } else if (res.code === "InvalidEmail") {
                    errorMessage = "Invalid email format"
                } else {
                    errorMessage = res.code as string;
                }
                setError(errorMessage)
                showToast(errorMessage, "error")
            } else {
                router.refresh()
                router.push("/dashboard")
                showToast("Logged in successfully", "success")
            }
        } catch (error) {
            console.error(error)
            showToast("Something went wrong", "error")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 w-full max-w-md">
            <div className="mb-8 text-center">
                <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">Welcome back</h1>
                <p className="text-neutral-500 dark:text-neutral-400">Sign in to manage your forms</p>
            </div>

            {error && (
                <div className="mb-6 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-3 rounded-lg flex items-center gap-2 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Email address</label>
                    <div className="relative">
                        <input
                            type="text"
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
                            {showPassword ? (
                                <EyeOff className="h-5 w-5" />
                            ) : (
                                <Eye className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sign in"}
                    </button>
                </div>
            </form>

            <div className="mt-6 text-center text-sm text-neutral-500 dark:text-neutral-400">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
                    Sign up
                </Link>
            </div>
        </div>
    )
}

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col items-center justify-center p-4">
            <LoginForm />
        </div>
    )
}
