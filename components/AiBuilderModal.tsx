"use client"

import { useState, useEffect } from "react"
import { Sparkles, Loader2 } from "lucide-react"
import { useFormEditorStore, FormField } from "@/store/form-editor"
import { useToast } from "@/hooks/use-toast"

export function AiBuilderModal({ onClose }: { onClose: () => void }) {
    const [error, setError] = useState<string | null>(null)
    const [prompt, setPrompt] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isConfirming, setIsConfirming] = useState(false)
    const [proposedData, setProposedData] = useState<{ title?: string, description?: string, fields?: FormField[] } | null>(null)
    const { setTitle, setDescription, setFields, fields, title, description } = useFormEditorStore()
    const { showToast } = useToast()

    const isImprovementMode = fields && fields.length > 0

    const handleGenerate = async (promptOverride?: string) => {
        // Use override if provided, otherwise use state prompt. 
        // If improvement mode and prompt is empty, use default analysis prompt.
        let promptToUse = promptOverride || prompt.trim()

        if (!promptToUse && isImprovementMode) {
            promptToUse = "Analyze the current form structure and suggest relevant improvements, additions, or refinements."
        }

        if (!promptToUse) return

        setIsLoading(true)
        setError(null)
        try {
            // Include current form context if fields exist
            const currentContext = fields && fields.length > 0 ? {
                currentTitle: title,
                currentDescription: description,
                currentFields: fields
            } : null

            const res = await fetch('/api/ai/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: promptToUse,
                    currentForm: currentContext
                })
            })

            const contentType = res.headers.get('content-type')
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Server returned non-JSON response')
            }

            if (res.status === 429) {
                const errorData = await res.json()
                const msg = errorData.message || "Daily limit reached"
                setError(msg)
                showToast(msg, "error")
                return
            }

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({ error: 'Unknown error' }))
                const msg = errorData.error || "Failed to generate form"
                setError(msg)
                throw new Error(msg)
            }

            const data = await res.json()
            setProposedData(data)
            setIsConfirming(true)
        } catch (error) {
            console.error('Full error:', error)
            const msg = error instanceof Error ? error.message : "Failed to generate form. Please try again."
            setError(msg)
            showToast(msg, "error")
        } finally {
            setIsLoading(false)
        }
    }

    // Auto-trigger removed to allow optional prompt


    const handleConfirm = () => {
        if (!proposedData) return

        if (proposedData.title) setTitle(proposedData.title)
        if (proposedData.description) setDescription(proposedData.description)
        if (proposedData.fields) setFields(proposedData.fields as FormField[])

        showToast("Form updated successfully!", "success")
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-xl w-full max-w-lg overflow-hidden border border-neutral-200 dark:border-neutral-800 animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-3 shrink-0">
                    <div className="h-10 w-10 bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 rounded-full flex items-center justify-center">
                        <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                            {isConfirming ? "Confirm Changes" : (isImprovementMode ? "Improve with AI" : "Generate with AI")}
                        </h2>
                        <p className="text-sm text-neutral-500">
                            {isConfirming
                                ? "Review the proposed changes below before applying."
                                : (isImprovementMode
                                    ? "Describe your improvements (optional) or let AI analyze it."
                                    : "Describe your form and let AI build it for you.")}
                        </p>
                    </div>
                </div>

                <div className="p-6 overflow-y-auto flex-1">
                    {error ? (
                        <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                            <div className="h-12 w-12 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mb-4">
                                <span className="text-xl font-bold">!</span>
                            </div>
                            <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">Something went wrong</h3>
                            <p className="text-sm text-neutral-500 max-w-xs mb-6">{error}</p>
                            <button
                                onClick={() => {
                                    setError(null);
                                    onClose()
                                    // if (isImprovementMode) handleGenerate("Analyze the current form structure and suggest relevant improvements, additions, or refinements.");
                                }}
                                className="px-4 py-2 text-sm font-medium bg-neutral-100 text-neutral-900 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700 rounded-lg transition-colors"
                            >
                                Close 🥲😭
                            </button>
                        </div>
                    ) : !isConfirming ? (
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder={isImprovementMode
                                ? "e.g., Add an email field, make comments required... (Leave empty for auto-analysis)"
                                : "e.g., Create a customer feedback survey with name, email, rating, and comments..."}
                            className="w-full h-32 p-3 text-neutral-900 dark:text-white bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none resize-none"
                        />
                    ) : (
                        <div className="space-y-4">
                            {proposedData?.title && (
                                <div className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                                    <div className="text-xs font-medium text-neutral-500 uppercase mb-1">Title</div>
                                    <div className="font-medium">{proposedData.title}</div>
                                </div>
                            )}
                            {proposedData?.description && (
                                <div className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                                    <div className="text-xs font-medium text-neutral-500 uppercase mb-1">Description</div>
                                    <div className="text-sm text-neutral-600 dark:text-neutral-300">{proposedData.description}</div>
                                </div>
                            )}
                            {proposedData?.fields && (
                                <div>
                                    <div className="text-xs font-medium text-neutral-500 uppercase mb-2">Fields ({proposedData.fields.length})</div>
                                    <div className="space-y-2">
                                        {proposedData.fields.map((field: any, i: number) => (
                                            <div key={i} className="flex items-center gap-2 p-2 border border-neutral-100 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-900">
                                                <span className="text-xs font-mono bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded">{field.type}</span>
                                                <span className="text-sm font-medium">{field.label}</span>
                                                {field.validation?.required && <span className="text-xs text-red-500 font-medium">Required</span>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="p-4 bg-neutral-50 dark:bg-neutral-950 flex items-center justify-end gap-3 border-t border-neutral-200 dark:border-neutral-800 shrink-0">
                    <button
                        onClick={() => {
                            if (isConfirming) {
                                setIsConfirming(false)
                            } else {
                                onClose()
                            }
                        }}
                        className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                        disabled={isLoading}
                    >
                        {isConfirming ? "Back" : "Cancel"}
                    </button>
                    <button
                        onClick={isConfirming ? handleConfirm : () => handleGenerate()}
                        disabled={(!isConfirming && !prompt.trim() && !isImprovementMode) || isLoading}
                        className="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Sparkles className="h-4 w-4" />
                                {isConfirming ? "Confirm Changes" : (isImprovementMode ? (prompt.trim() ? "Improve Form" : "Auto Improve") : "Generate Form")}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}
