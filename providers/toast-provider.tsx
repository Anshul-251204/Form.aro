"use client"

import React, { createContext, useContext, useState, useCallback } from "react"
import { Toast, ToastType } from "@/components/ui/Toast"

interface ToastContextType {
    showToast: (message: string, type: ToastType) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: ToastType }>>([])

    const showToast = useCallback((message: string, type: ToastType) => {
        const id = Math.random().toString(36).substring(7)
        setToasts(prev => [...prev, { id, message, type }])
    }, [])

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id))
    }, [])

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed bottom-0 right-0 p-4 z-50 flex flex-col gap-2">
                {toasts.map(toast => (
                    <Toast
                        key={toast.id}
                        id={toast.id}
                        type={toast.type}
                        message={toast.message}
                        onClose={removeToast}
                    />
                ))}
            </div>
        </ToastContext.Provider>
    )
}

export function useToast() {
    const context = useContext(ToastContext)
    if (context === undefined) {
        throw new Error("useToast must be used within a ToastProvider")
    }
    return context
}
