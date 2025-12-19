"use client"

import Link from "next/link"
import { ArrowLeft, Download, ChevronDown, ChevronRight, Calculator, Eye, FileText } from "lucide-react"
import { ClientSideTimestamp } from "@/components/ClientSideTimestamp"
import { useState, Fragment } from "react"
import { FormField } from "@/store/form-editor"

interface Submission {
    id: string
    submittedAt: string
    data: Record<string, any>
}

interface SubmissionsViewProps {
    formId: string
    formTitle: string
    fields: FormField[]
    submissions: Submission[]
    views: number
}

export function SubmissionsView({ formId, formTitle, fields, submissions, views }: SubmissionsViewProps) {
    const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({})

    const toggleRow = (id: string) => {
        setExpandedRows(prev => ({
            ...prev,
            [id]: !prev[id]
        }))
    }

    const handleExportCSV = () => {
        const headers = ['ID', 'Submitted At', ...fields.map(f => f.label)]
        const csvContent = [
            headers.join(','),
            ...submissions.map(sub => {
                const values = [
                    sub.id,
                    new Date(sub.submittedAt).toLocaleString(),
                    ...fields.map(f => {
                        const val = sub.data[f._id]
                        if (typeof val === 'object') return JSON.stringify(val).replace(/,/g, ';')
                        return String(val || '').replace(/,/g, ';')
                    })
                ]
                return values.join(',')
            })
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `${formTitle.toLowerCase().replace(/\s+/g, '-')}-submissions.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const totalResponses = submissions.length
    const completionRate = views > 0 ? Math.round((totalResponses / views) * 100) : 0

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white mb-4"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Link>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">{formTitle}</h1>
                            <p className="text-neutral-500 dark:text-neutral-400 mt-1">
                                Form ID: {formId}
                            </p>
                        </div>
                        <button
                            onClick={handleExportCSV}
                            disabled={submissions.length === 0}
                            className="inline-flex items-center justify-center rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-900 shadow-sm hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Download className="mr-2 h-4 w-4" />
                            <span className="hidden sm:block">Export CSV</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Eye className="h-24 w-24" />
                        </div>
                        <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-2 z-10 relative">Total Views</h3>
                        <p className="text-4xl font-bold text-neutral-900 dark:text-white z-10 relative">{views}</p>
                    </div>
                    <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <FileText className="h-24 w-24" />
                        </div>
                        <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-2 z-10 relative">Total Responses</h3>
                        <p className="text-4xl font-bold text-neutral-900 dark:text-white z-10 relative">{totalResponses}</p>
                    </div>
                    <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Calculator className="h-24 w-24" />
                        </div>
                        <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-2 z-10 relative">Completion Rate</h3>
                        <div className="flex items-end gap-2 z-10 relative">
                            <p className="text-4xl font-bold text-neutral-900 dark:text-white">{completionRate}%</p>
                            <p className="text-sm text-neutral-500 mb-1.5">conversion</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                    <div className="p-6 border-b border-neutral-200 dark:border-neutral-800">
                        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Recent Submissions</h2>
                    </div>

                    {submissions.length === 0 ? (
                        <div className="p-12 text-center">
                            <p className="text-neutral-500 dark:text-neutral-400">No submissions yet.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-neutral-50 dark:bg-neutral-950">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider w-12"></th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Submitted At</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Data Preview</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                                    {submissions.map((sub) => {
                                        const isExpanded = expandedRows[sub.id]
                                        // Preview first non-empty field value
                                        const firstValue = fields.find(f => sub.data[f._id])
                                        const previewText = firstValue ? String(sub.data[firstValue._id] || '') : 'View Details'

                                        return (
                                            <Fragment key={sub.id}>
                                                <tr
                                                    onClick={() => toggleRow(sub.id)}
                                                    className={`cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors ${isExpanded ? 'bg-neutral-50 dark:bg-neutral-800/50' : ''}`}
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                                                        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-white">
                                                        <ClientSideTimestamp timestamp={sub.submittedAt} />
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
                                                        <span className="truncate block max-w-md">{previewText}</span>
                                                    </td>
                                                </tr>
                                                {isExpanded && (
                                                    <tr className="bg-neutral-50 dark:bg-neutral-900/50">
                                                        <td colSpan={3} className="px-6 py-4">
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                {fields.map((field) => (
                                                                    <div key={field._id} className="bg-white dark:bg-neutral-950 p-4 rounded-lg border border-neutral-200 dark:border-neutral-800">
                                                                        <label className="text-xs font-medium text-neutral-500 uppercase tracking-wide block mb-1">
                                                                            {field.label}
                                                                        </label>
                                                                        <div className="text-sm text-neutral-900 dark:text-white wrap-break-word">
                                                                            {String(sub.data[field._id] || '-')}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </Fragment>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
