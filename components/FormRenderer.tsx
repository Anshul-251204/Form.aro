"use client"

import { FormField } from "@/store/form-editor"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface FormRendererProps {
    title: string
    description?: string
    fields: FormField[]
    isPreview?: boolean
    onSubmit?: (data: Record<string, any>) => Promise<void>
}

export function FormRenderer({ title, description, fields, isPreview = false, onSubmit }: FormRendererProps) {
    const [formData, setFormData] = useState<Record<string, any>>({})
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleInputChange = (fieldId: string, value: any) => {
        setFormData(prev => ({ ...prev, [fieldId]: value }))
        // Clear error when user types
        if (errors[fieldId]) {
            setErrors(prev => {
                const newErrors = { ...prev }
                delete newErrors[fieldId]
                return newErrors
            })
        }
    }

    const handleSubmit = async () => {
        // Basic validation
        const newErrors: Record<string, string> = {}
        let hasErrors = false

        fields.forEach(field => {
            const value = formData[field._id]
            const validation = field.validation || {}
            // Backward compatibility
            const required = validation.required ?? field.required ?? false
            const minVal = validation.min ?? field.min
            const maxVal = validation.max ?? field.max

            const min = (minVal !== undefined && minVal !== null && String(minVal) !== '') ? Number(minVal) : undefined
            const max = (maxVal !== undefined && maxVal !== null && String(maxVal) !== '') ? Number(maxVal) : undefined

            // Required check
            if (required && !value) {
                newErrors[field._id] = `${field.label} is required`
                hasErrors = true
                return
            }

            if (value) {
                // Email validation
                if (field.type === 'email') {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                    if (!emailRegex.test(value)) {
                        newErrors[field._id] = `Please enter a valid email address`
                        hasErrors = true
                    }
                }

                // Number validation
                if (field.type === 'number') {
                    const numVal = Number(value)
                    if (min !== undefined && numVal < min) {
                        newErrors[field._id] = `Value must be at least ${min}`
                        hasErrors = true
                    }
                    if (max !== undefined && numVal > max) {
                        newErrors[field._id] = `Value must be at most ${max}`
                        hasErrors = true
                    }
                }

                // Text length validation
                if (field.type === 'text' || field.type === 'long_text') {
                    if (min !== undefined && value.length < min) {
                        newErrors[field._id] = `Must be at least ${min} characters`
                        hasErrors = true
                    }
                    if (max !== undefined && value.length > max) {
                        newErrors[field._id] = `Must be at most ${max} characters`
                        hasErrors = true
                    }
                }
            }
        })

        if (hasErrors) {
            setErrors(newErrors)
            return
        }

        if (isPreview) {
            alert("This is a preview. Submission is disabled.")
            return
        }

        if (!onSubmit) return

        setIsSubmitting(true)
        try {
            await onSubmit(formData)
            setIsSubmitted(true)
        } catch (error) {
            console.error(error)
            alert("Failed to submit form")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isSubmitted) {
        return (
            <div className="max-w-3xl mx-auto p-4 md:p-8">
                <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-8 text-center">
                    <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">Thank you!</h1>
                    <p className="text-neutral-600 dark:text-neutral-400">Your response has been recorded.</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-6 text-blue-600 hover:text-blue-700 font-medium"
                    >
                        Submit another response
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-3xl mx-auto p-4 md:p-8">
            <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-6 md:p-8 mb-6 border-t-8 border-t-blue-600">
                <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white mb-2">{title}</h1>
                {description && <p className="text-neutral-600 dark:text-neutral-400">{description}</p>}
                {isPreview && (
                    <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-medium">
                        Preview Mode
                    </div>
                )}
            </div>

            <div className="space-y-4">
                {fields.map((field) => (
                    <div key={field._id} className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-6">
                        <label className="block text-base font-medium text-neutral-900 dark:text-white mb-2">
                            {field.label} {(field.validation?.required ?? field.required) && <span className="text-red-500">*</span>}
                        </label>

                        {(field.type === 'text' || field.type === 'email' || field.type === 'number') && (
                            <input
                                type={field.type}
                                className={cn(
                                    "w-full px-3 py-2 rounded-md border bg-white dark:bg-neutral-950 focus:outline-none focus:ring-2 focus:ring-blue-500",
                                    errors[field._id]
                                        ? "border-red-500 focus:ring-red-500"
                                        : "border-neutral-200 dark:border-neutral-800"
                                )}
                                placeholder="Your answer"
                                value={formData[field._id] || ''}
                                onChange={(e) => handleInputChange(field._id, e.target.value)}
                            />
                        )}

                        {field.type === 'long_text' && (
                            <textarea
                                className="w-full px-3 py-2 rounded-md border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Your answer"
                                rows={3}
                                value={formData[field._id] || ''}
                                onChange={(e) => handleInputChange(field._id, e.target.value)}
                            />
                        )}

                        {field.type === 'multiple_choice' && (
                            <div className="space-y-2">
                                {field.options?.map((option, i) => (
                                    <label key={i} className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            name={field._id}
                                            className="h-4 w-4 text-blue-600 border-neutral-300 focus:ring-blue-500"
                                            checked={formData[field._id] === option}
                                            onChange={() => handleInputChange(field._id, option)}
                                        />
                                        <span className="text-neutral-700 dark:text-neutral-300">{option}</span>
                                    </label>
                                ))}
                            </div>
                        )}

                        {field.type === 'checkbox' && (
                            <div className="space-y-2">
                                {field.options?.map((option, i) => (
                                    <label key={i} className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 text-blue-600 border-neutral-300 rounded focus:ring-blue-500"
                                            checked={(formData[field._id] || []).includes(option)}
                                            onChange={(e) => {
                                                const current = formData[field._id] || []
                                                const next = e.target.checked
                                                    ? [...current, option]
                                                    : current.filter((o: string) => o !== option)
                                                handleInputChange(field._id, next)
                                            }}
                                        />
                                        <span className="text-neutral-700 dark:text-neutral-300">{option}</span>
                                    </label>
                                ))}
                            </div>
                        )}

                        {field.type === 'dropdown' && (
                            <select
                                className="w-full px-3 py-2 rounded-md border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData[field._id] || ''}
                                onChange={(e) => handleInputChange(field._id, e.target.value)}
                            >
                                <option value="">Choose</option>
                                {field.options?.map((option, i) => (
                                    <option key={i} value={option}>{option}</option>
                                ))}
                            </select>
                        )}

                        {field.type === 'date' && (
                            <input
                                type="date"
                                className="w-full px-3 py-2 rounded-md border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData[field._id] || ''}
                                onChange={(e) => handleInputChange(field._id, e.target.value)}
                            />
                        )}

                        {errors[field._id] && (
                            <p className="text-sm text-red-500 mt-2">{errors[field._id]}</p>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-8 flex justify-between items-center">
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
                >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
                <button
                    onClick={() => setFormData({})}
                    className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                >
                    Clear form
                </button>
            </div>
        </div>
    )
}
