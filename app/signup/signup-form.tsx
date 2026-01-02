"use client"

import { useState } from "react"
import { registerUser } from "@/actions/register"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Mail, Lock, Loader2, ArrowLeft, Eye, EyeOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function SignupForm() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const { showToast } = useToast()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const formData = new FormData()
            formData.append("email", email)
            formData.append("password", password)

            const result = await registerUser(formData)

            if (result?.error) {
                // Show first error message
                const msg = Object.values(result.error).flat()[0] as string
                showToast(msg || "Registration failed", "error")
            } else if (result?.msg && result.status !== 201) {
                showToast(result.msg, "error")
            } else {
                router.push("/login")
                showToast("Account created! Please login.", "success")
            }
        } catch (error) {
            console.error(error)
            showToast("Something went wrong", "error")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 w-full max-w-md relative">
            <Link
                href="/login"
                className="absolute top-8 left-8 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                title="Back to login"
            >
                <ArrowLeft className="h-5 w-5" />
            </Link>

            <div className="mb-8 text-center pt-2">
                <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">Create Account</h1>
                <p className="text-neutral-500 dark:text-neutral-400">Get started with FormHost today</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
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
                            {showPassword ? (
                                <EyeOff className="h-5 w-5" />
                            ) : (
                                <Eye className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">Must be at least 8 characters long</p>
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sign up"}
                    </button>
                </div>
            </form>

            <div className="mt-6 text-center text-sm text-neutral-500 dark:text-neutral-400">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
                    Sign in
                </Link>
            </div>
        </div>
    )
}
