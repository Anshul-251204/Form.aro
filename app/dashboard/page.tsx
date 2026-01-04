"use client"

import { Copy, Plus, Check, Trash2 } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Modal } from "@/components/ui/Modal"
import FormAroLogo from "@/components/TextLogo"

interface Form {
    id: string
    title: string
    responses: number
    createdAt: string
    published: boolean
    views: number
}

function CopyButton({ url }: { url: string }) {
    const [copied, setCopied] = useState(false)
    const { showToast } = useToast()

    const handleCopy = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        navigator.clipboard.writeText(url)
        setCopied(true)
        showToast("Link copied to clipboard", "success")
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <button
            onClick={handleCopy}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-lg transition-colors"
            title="Copy Public Link"
        >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </button>
    )
}

export default function DashboardPage() {
    const [forms, setForms] = useState<Form[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [formToDelete, setFormToDelete] = useState<string | null>(null)
    const router = useRouter()
    const { showToast } = useToast()

    useEffect(() => {
        fetch("/api/forms")
            .then((res) => res.json())
            .then((data) => {
                setForms(data)
                setIsLoading(false)
            })
            .catch((err) => {
                console.error(err)
                setIsLoading(false)
                showToast("Failed to load forms", "error")
            })
    }, [showToast])

    const handleEditClick = (e: React.MouseEvent, formId: string) => {
        e.preventDefault()
        e.stopPropagation()
        router.push(`/builder/${formId}`)
    }

    const confirmDelete = async () => {
        if (!formToDelete) return

        try {
            const res = await fetch(`/api/forms/${formToDelete}`, {
                method: 'DELETE'
            })

            if (res.ok) {
                setForms(forms.filter(f => f.id !== formToDelete))
                showToast("Form deleted successfully", "success")
            } else {
                showToast("Failed to delete form", "error")
            }
        } catch (error) {
            console.error("Failed to delete form", error)
            showToast("Failed to delete form", "error")
        } finally {
            setIsDeleteModalOpen(false)
            setFormToDelete(null)
        }
    }

    const handleDeleteClick = (e: React.MouseEvent, formId: string) => {
        e.preventDefault()
        e.stopPropagation()
        setFormToDelete(formId)
        setIsDeleteModalOpen(true)
    }

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
            <div className="max-w-6xl mx-auto p-8 px-4">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Your Forms</h1>
                    <Link href="/builder/new">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                            <Plus className="h-4 w-4" />
                            Create Form
                        </button>
                    </Link>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white dark:bg-neutral-900 h-48 rounded-xl border border-neutral-200 dark:border-neutral-800 animate-pulse" />
                        ))}
                    </div>
                ) : forms.length === 0 ? (
                    <div className="text-center py-12 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800">
                        <p className="text-neutral-500 dark:text-neutral-400 mb-4">No forms created yet.</p>
                        <Link href="/builder/new">
                            <button className="text-blue-600 hover:underline text-sm font-medium">
                                Create your first form
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {forms.map((form) => (
                            <Link
                                href={`/dashboard/forms/${form.id}`}
                                key={form.id}
                                className="block group"
                            >
                                <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-blue-500/50 hover:shadow-sm transition-all h-full flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="font-semibold text-neutral-900 dark:text-white group-hover:text-blue-600 transition-colors">
                                                    {form.title}
                                                </h3>
                                                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                                                    Created {new Date(form.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className={`px-2 py-1 rounded text-xs font-medium ${form.published
                                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                : "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400"
                                                }`}>
                                                {form.published ? "Published" : "Draft"}
                                            </div>
                                        </div>

                                        <div className="flex gap-4 mb-6">
                                            <div>
                                                <p className="text-2xl font-bold text-neutral-900 dark:text-white">{form.responses || 0}</p>
                                                <p className="text-xs text-neutral-500 uppercase tracking-wide">Responses</p>
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold text-neutral-900 dark:text-white">{form.views || 0}</p>
                                                <p className="text-xs text-neutral-500 uppercase tracking-wide">Views</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={(e) => handleEditClick(e, form.id)}
                                                className="text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white px-3 py-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={(e) => handleDeleteClick(e, form.id)}
                                                className="text-sm font-medium text-red-600 hover:text-red-700 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                title="Delete Form"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                                View Results &rarr;
                                            </span>
                                            {form.published && (
                                                <CopyButton url={`${window.location.origin}/submit/${form.id}`} />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Delete Form?"
                description="This action cannot be undone. This will permanently delete the form and all its responses."
            >
                <div className="flex justify-end gap-3 mt-4">
                    <button
                        onClick={() => setIsDeleteModalOpen(false)}
                        className="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={confirmDelete}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                    >
                        Delete Form
                    </button>
                </div>
            </Modal>
        </div>
    )
}
