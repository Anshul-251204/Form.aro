"use client"

import { X, CheckCircle, AlertCircle, Info } from "lucide-react"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export type ToastType = 'success' | 'error' | 'info'

export interface ToastProps {
    id: string
    type: ToastType
    message: string
    onClose: (id: string) => void
}

export function Toast({ id, type, message, onClose }: ToastProps) {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        // Trigger enter animation
        requestAnimationFrame(() => setIsVisible(true))

        // Auto dismiss
        const timer = setTimeout(() => {
            setIsVisible(false)
            setTimeout(() => onClose(id), 300) // Wait for exit animation
        }, 5000)

        return () => clearTimeout(timer)
    }, [id, onClose])

    const icons = {
        success: <CheckCircle className="h-5 w-5 text-green-500" />,
        error: <AlertCircle className="h-5 w-5 text-red-500" />,
        info: <Info className="h-5 w-5 text-blue-500" />
    }

    const bgColors = {
        success: "bg-white dark:bg-neutral-900 border-green-200 dark:border-green-900",
        error: "bg-white dark:bg-neutral-900 border-red-200 dark:border-red-900",
        info: "bg-white dark:bg-neutral-900 border-blue-200 dark:border-blue-900"
    }

    return (
        <div
            className={cn(
                "fixed bottom-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg transition-all duration-300 transform",
                bgColors[type],
                isVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
            )}
        >
            {icons[type]}
            <p className="text-sm font-medium text-neutral-900 dark:text-white">{message}</p>
            <button
                onClick={() => {
                    setIsVisible(false)
                    setTimeout(() => onClose(id), 300)
                }}
                className="ml-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    )
}
