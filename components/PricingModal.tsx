"use client"
import { useState } from "react"
import { Check, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { createPortal } from "react-dom"

interface PricingModalProps {
    isOpen: boolean
    onClose: () => void
}

const PLANS = [
    {
        id: "basic",
        name: "Basic",
        forms: 10,
        price: 50,
        features: ["10 AI Form Generations", "Basic Support", "Analytics"]
    },
    {
        id: "pro",
        name: "Pro",
        forms: 20,
        price: 100,
        features: ["20 AI Form Generations", "Priority Support" , "Analytics"]
    },
    {
        id: "enterprise",
        name: "Enterprise",
        forms: 40,
        price: 500,
        features: ["40 AI Form Generations", "24/7 Support", "All Pro Features", "Custom Branding"]
    }
]

export function PricingModal({ isOpen, onClose }: PricingModalProps) {
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null)
    const { showToast } = useToast()
    const router = useRouter()

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script")
            script.src = "https://checkout.razorpay.com/v1/checkout.js"
            script.onload = () => resolve(true)
            script.onerror = () => resolve(false)
            document.body.appendChild(script)
        })
    }

    const handlePurchase = async (plan: typeof PLANS[0]) => {
        try {
            setLoadingPlan(plan.id)

            const isLoaded = await loadRazorpay()
            if (!isLoaded) {
                showToast("Failed to load payment gateway", "error")
                return
            }

            // 1. Create Order
            const response = await fetch("/api/payment/order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    planId: plan.id,
                    amount: plan.price
                })
            })

            const order = await response.json()

            if (order.error) {
                showToast(order.error, "error")
                return
            }

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "FormHost AI",
                description: `Purchase ${plan.name} Plan`,
                order_id: order.id,
                handler: async function (response: any) {
                    // 2. Verify Payment
                    try {
                        const verifyRes = await fetch("/api/payment/verify", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                planId: plan.id
                            })
                        })

                        const verifyData = await verifyRes.json()

                        if (verifyData.success) {
                            showToast("Payment successful! Credits added.", "success")
                            onClose()
                            router.refresh()
                        } else {
                            showToast("Payment verification failed", "error")
                        }
                    } catch (error) {
                        showToast("Payment verification failed", "error")
                    }
                },
                prefill: {
                    name: "User", // Can fetch from session if needed
                    email: "user@example.com",
                },
                theme: {
                    color: "#2563EB",
                },
            }

            const paymentObject = new (window as any).Razorpay(options)
            paymentObject.open()

        } catch (error) {
            console.error(error)
            showToast("Something went wrong", "error")
        } finally {
            setLoadingPlan(null)
        }
    }

    if (!isOpen) return null

    return createPortal(
        <div
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="relative bg-white dark:bg-neutral-900 rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-neutral-200 dark:border-neutral-800 animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between sticky top-0 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Upgrade Plan</h2>
                        <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">
                            Choose a plan that fits your needs
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-neutral-500"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {PLANS.map((plan) => (
                            <div
                                key={plan.id}
                                className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 flex flex-col hover:border-blue-500 dark:hover:border-blue-500 transition-colors relative overflow-hidden bg-neutral-50/50 dark:bg-neutral-900/50"
                            >
                                {plan.id === "pro" && (
                                    <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs px-3 py-1 rounded-bl-xl font-medium">
                                        Popular
                                    </div>
                                )}
                                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">{plan.name}</h3>
                                <div className="mt-2 flex items-baseline gap-1">
                                    <span className="text-3xl font-bold text-neutral-900 dark:text-white">₹{plan.price}</span>
                                </div>
                                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">{plan.forms} Form Generations</p>

                                <ul className="mt-6 space-y-3 flex-1">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
                                            <Check className="h-4 w-4 text-green-500 shrink-0" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    onClick={() => handlePurchase(plan)}
                                    disabled={loadingPlan !== null}
                                    className={`mt-6 w-full py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${plan.id === "pro"
                                        ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                                        : "bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-700"
                                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    {loadingPlan === plan.id && <Loader2 className="h-4 w-4 animate-spin" />}
                                    {loadingPlan === plan.id ? "Processing..." : "Buy Now"}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>,
        document.body
    )
}
