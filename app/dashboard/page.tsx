"use client"

import { Copy, Plus, Check } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

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

    const handleCopy = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        navigator.clipboard.writeText(url)
        setCopied(true)
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
    const router = useRouter()

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
            })
    }, [])

    const handleEditClick = (e: React.MouseEvent, formId: string) => {
        e.preventDefault()
        e.stopPropagation()
        router.push(`/builder/${formId}`)
    }

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
            <header className="h-16 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 flex items-center px-6 justify-between">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                        F
                    </div>
                    <span className="font-bold text-xl text-neutral-900 dark:text-white">FormHost</span>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                    >
                        Sign out
                    </button>
                </div>
            </header>

            <div className="max-w-6xl mx-auto p-8">
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
                                                <p className="text-2xl font-bold text-neutral-900 dark:text-white">{form.views || 0}</p>
                                                <p className="text-xs text-neutral-500 uppercase tracking-wide">Views</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                                        <button
                                            onClick={(e) => handleEditClick(e, form.id)}
                                            className="text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white px-3 py-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                                        >
                                            Edit
                                        </button>

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
        </div>
    )
}
