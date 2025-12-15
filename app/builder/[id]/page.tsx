"use client"

import { FormBuilder } from "@/components/form-builder/FormBuilder"
import { useFormEditorStore } from "@/store/form-editor"
import { use, useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Globe, Lock } from "lucide-react"

export default function BuilderPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const [isSaving, setIsSaving] = useState(false)
    const [isPublished, setIsPublished] = useState(false)
    const { fields, setFields, title, setTitle, description, setDescription } = useFormEditorStore()

    useEffect(() => {
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
            .catch(err => console.error(err))
    }, [id, setFields, setTitle, setDescription])

    const handlePreview = () => {
        window.open(`/preview/${id}`, '_blank')
    }

    const saveForm = async () => {
        await fetch(`/api/forms/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title,
                description,
                fields
            })
        })
    }

    const handlePublish = async () => {
        setIsSaving(true)
        try {
            await saveForm()
            await fetch(`/api/forms/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ published: true })
            })
            setIsPublished(true)
            const url = `${window.location.origin}/submit/${id}`
            prompt("Form published! Share this URL:", url)
        } catch (error) {
            console.error('Failed to publish', error)
            alert('Failed to publish form')
        } finally {
            setIsSaving(false)
        }
    }

    const handleUpdate = async () => {
        setIsSaving(true)
        try {
            await saveForm()
            alert('Form updated successfully!')
        } catch (error) {
            console.error('Failed to update', error)
            alert('Failed to update form')
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
            alert('Form unpublished. It is now in draft mode.')
        } catch (error) {
            console.error('Failed to unpublish', error)
            alert('Failed to unpublish form')
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
            <header className="h-16 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 flex items-center px-6 justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/dashboard"
                        className="p-2 -ml-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        title="Back to Dashboard"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div className="h-8 w-1 bg-neutral-200 dark:bg-neutral-800 rounded-full" />
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                            F
                        </div>
                        <span className="font-bold text-lg text-neutral-900 dark:text-white">Builder</span>
                        {isPublished ? (
                            <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-medium flex items-center gap-1">
                                <Globe className="h-3 w-3" /> Published
                            </span>
                        ) : (
                            <span className="px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400 text-xs font-medium flex items-center gap-1">
                                <Lock className="h-3 w-3" /> Draft
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={handlePreview}
                        className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                    >
                        Preview
                    </button>

                    {isPublished && (
                        <button
                            onClick={handleUnpublish}
                            disabled={isSaving}
                            className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors disabled:opacity-50"
                        >
                            Unpublish
                        </button>
                    )}

                    <button
                        onClick={isPublished ? handleUpdate : handlePublish}
                        disabled={isSaving}
                        className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 min-w-[100px]"
                    >
                        {isSaving ? 'Saving...' : (isPublished ? 'Update' : 'Publish')}
                    </button>
                </div>
            </header>
            <FormBuilder />
        </div>
    )
}
