"use client"

import { FormBuilder } from "@/components/form-builder/FormBuilder"
import { useFormEditorStore } from "@/store/form-editor"
import { use, useState, useEffect } from "react"
import Link from "next/link"
import { AiBuilderModal } from "@/components/AiBuilderModal"
import { ArrowLeft, Globe, Lock, Copy, Check, Sparkles, Menu, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function BuilderPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const [isSaving, setIsSaving] = useState(false)
    const [isPublished, setIsPublished] = useState(false)
    const [copied, setCopied] = useState(false)
    const [showAiModal, setShowAiModal] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const { fields, setFields, title, setTitle, description, setDescription } = useFormEditorStore()
    const router = useRouter()
    const { showToast } = useToast()

    const enableAiBuilder = process.env.NEXT_PUBLIC_ENABLE_AI_BUILDER === 'true'

    useEffect(() => {
        // If creating a new form, skip fetch and init default state
        if (id === "new") {
            setTitle("Untitled Form")
            setDescription("")
            setFields([])
            setIsPublished(false)
            return
        }

        // Fetch form data on mount
        fetch(`/api/forms/${id}`)
            .then(res => {
                if (!res.ok) throw new Error("Failed to load form")
                return res.json()
            })
            .then(data => {
                if (data.fields) {
                    setFields(data.fields)
                }
                if (data.title) setTitle(data.title)
                if (data.description) setDescription(data.description)
                if (data.published !== undefined) setIsPublished(data.published)
            })
            .catch(err => {
                console.error(err)
                showToast("Failed to load form", "error")
            })
    }, [id, setFields, setTitle, setDescription, showToast])

    const handlePreview = () => {
        if (id === "new") {
            showToast("Please save the form before previewing", "info")
            return
        }
        window.open(`/preview/${id}`, '_blank')
    }

    const saveForm = async () => {
        const isNew = id === "new"
        const url = isNew ? '/api/forms' : `/api/forms/${id}`
        const method = isNew ? 'POST' : 'PUT'

        const res = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title,
                description,
                fields
            })
        })

        if (!res.ok) throw new Error("Failed to save")

        const data = await res.json()

        if (isNew) {
            // Redirect to the new ID
            router.replace(`/builder/${data.id}`)
            return data.id
        }

        return id
    }

    const handlePublish = async () => {
        setIsSaving(true)
        try {
            const currentId = await saveForm()

            await fetch(`/api/forms/${currentId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ published: true })
            })
            setIsPublished(true)

            showToast("Form published successfully!", "success")

            // User requested redirect to dashboard
            setTimeout(() => router.push('/dashboard'), 1000)
        } catch (error) {
            console.error('Failed to publish', error)
            showToast("Failed to publish form", "error")
        } finally {
            setIsSaving(false)
        }
    }

    const handleUpdate = async () => {
        setIsSaving(true)
        try {
            await saveForm()
            showToast("Form updated successfully!", "success")
            // User requested redirect to dashboard
            setTimeout(() => router.push('/dashboard'), 1000)
        } catch (error) {
            console.error('Failed to update', error)
            showToast("Failed to update form", "error")
        } finally {
            setIsSaving(false)
        }
    }

    const handleUnpublish = async () => {
        if (!confirm("Are you sure you want to unpublish this form? It will no longer be accessible to the public.")) return

        setIsSaving(true)
        try {
            await fetch(`/api/forms/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ published: false })
            })
            setIsPublished(false)
            showToast("Form unpublished. It is now in draft mode.", "info")
        } catch (error) {
            console.error('Failed to unpublish', error)
            showToast("Failed to unpublish form", "error")
        } finally {
            setIsSaving(false)
        }
    }

    const handleCopyLink = () => {
        const url = `${window.location.origin}/submit/${id}`
        navigator.clipboard.writeText(url)
        setCopied(true)
        showToast("Link copied to clipboard", "success")
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
            <header className="h-16 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 flex items-center px-4 md:px-6 justify-between relative z-50">
                <div className="flex items-center gap-2 md:gap-4">
                    <Link
                        href="/dashboard"
                        className="p-2 -ml-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        title="Back to Dashboard"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div className="hidden md:block h-8 w-1 bg-neutral-200 dark:bg-neutral-800 rounded-full" />
                    <div className="flex items-center gap-2">
                        <div className="hidden md:flex h-8 w-8 bg-blue-600 rounded-lg items-center justify-center text-white font-bold">
                            F
                        </div>
                        <span className="font-bold text-lg text-neutral-900 dark:text-white hidden sm:block">Builder</span>
                        {isPublished ? (
                            <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-medium flex items-center gap-1">
                                <Globe className="h-3 w-3" /> <span className="hidden xs:inline">Published</span>
                            </span>
                        ) : (
                            <span className="px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400 text-xs font-medium flex items-center gap-1">
                                <Lock className="h-3 w-3" /> <span className="hidden xs:inline">Draft</span>
                            </span>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="md:hidden p-2 text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800 rounded-lg"
                >
                    {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-4">
                    {enableAiBuilder && !isPublished && (
                        <button
                            onClick={() => setShowAiModal(true)}
                            className="px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:hover:bg-purple-900/30 rounded-lg transition-colors flex items-center gap-2"
                        >
                            <Sparkles className="h-4 w-4" />
                            <span className="hidden lg:inline">
                                {fields.length > 0 ? "Improve with AI" : "Generate with AI"}
                            </span>
                            <span className="lg:hidden">AI</span>
                        </button>
                    )}

                    {isPublished && id !== "new" && (
                        <button
                            onClick={handleCopyLink}
                            className="px-3 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white flex items-center gap-2 transition-colors rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
                            title="Copy Public Link"
                        >
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            <span>{copied ? "Copied" : "Copy Link"}</span>
                        </button>
                    )}

                    <button
                        onClick={handlePreview}
                        className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                    >
                        Preview
                    </button>

                    {isPublished && id !== "new" && (
                        <button
                            onClick={handleUnpublish}
                            disabled={isSaving}
                            className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors disabled:opacity-50"
                        >
                            Unpublish
                        </button>
                    )}

                    <button
                        onClick={async () => {
                            setIsSaving(true)
                            try {
                                await saveForm()
                                showToast("Form saved successfully", "success")
                            } catch (error) {
                                console.error('Failed to save', error)
                                showToast("Failed to save form", "error")
                            } finally {
                                setIsSaving(false)
                            }
                        }}
                        disabled={isSaving}
                        className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors disabled:opacity-50"
                    >
                        Save
                    </button>

                    {!isPublished && (
                        <button
                            onClick={handlePublish}
                            disabled={isSaving}
                            className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 min-w-[100px]"
                        >
                            {isSaving ? 'Publishing...' : 'Publish'}
                        </button>
                    )}
                </div>

                {/* Mobile Menu Dropdown */}
                {isMenuOpen && (
                    <div className="absolute top-16 left-0 right-0 bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 p-4 flex flex-col gap-2 md:hidden shadow-lg animate-in slide-in-from-top-2">
                        {enableAiBuilder && !isPublished && (
                            <button
                                onClick={() => {
                                    setShowAiModal(true)
                                    setIsMenuOpen(false)
                                }}
                                className="w-full px-4 py-3 text-left text-sm font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400 rounded-lg flex items-center gap-2"
                            >
                                <Sparkles className="h-4 w-4" />
                                {fields.length > 0 ? "Improve with AI" : "Generate with AI"}
                            </button>
                        )}

                        <button
                            onClick={() => {
                                handlePreview()
                                setIsMenuOpen(false)
                            }}
                            className="w-full px-4 py-3 text-left text-sm font-medium text-neutral-600 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:bg-neutral-900 rounded-lg flex items-center gap-2"
                        >
                            <span className="flex-1">Preview Form</span>
                        </button>

                        {isPublished && id !== "new" && (
                            <button
                                onClick={() => {
                                    handleCopyLink()
                                    // Don't close immediately to show state
                                }}
                                className="w-full px-4 py-3 text-left text-sm font-medium text-neutral-600 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:bg-neutral-900 rounded-lg flex items-center gap-2"
                            >
                                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                {copied ? "Link Copied" : "Copy Public Link"}
                            </button>
                        )}

                        <div className="h-px bg-neutral-200 dark:bg-neutral-800 my-1" />

                        <button
                            onClick={async () => {
                                setIsSaving(true)
                                try {
                                    await saveForm()
                                    showToast("Form saved successfully", "success")
                                    setIsMenuOpen(false)
                                } catch (error) {
                                    console.error('Failed to save', error)
                                    showToast("Failed to save form", "error")
                                } finally {
                                    setIsSaving(false)
                                }
                            }}
                            disabled={isSaving}
                            className="w-full px-4 py-3 text-left text-sm font-medium text-neutral-600 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:bg-neutral-900 rounded-lg flex items-center gap-2"
                        >
                            Save Draft
                        </button>

                        {isPublished && id !== "new" && (
                            <button
                                onClick={() => {
                                    handleUnpublish()
                                    setIsMenuOpen(false)
                                }}
                                disabled={isSaving}
                                className="w-full px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg"
                            >
                                Unpublish Form
                            </button>
                        )}

                        {!isPublished && (
                            <button
                                onClick={() => {
                                    handlePublish()
                                    setIsMenuOpen(false)
                                }}
                                disabled={isSaving}
                                className="w-full px-4 py-3 text-center text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            >
                                {isSaving ? 'Publishing...' : 'Publish Form'}
                            </button>
                        )}
                    </div>
                )}
            </header>
            <FormBuilder />
            {showAiModal && <AiBuilderModal onClose={() => setShowAiModal(false)} />}
        </div>
    )
}
