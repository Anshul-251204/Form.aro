"use client"

import Link from "next/link"
import { ArrowLeft, Download, ChevronDown, ChevronRight, Calculator, Eye, FileText, QrCode, X } from "lucide-react"
import { ClientSideTimestamp } from "@/components/ClientSideTimestamp"
import { useState, Fragment, useEffect } from "react"
import { FormField } from "@/store/form-editor"
import { QRCodeCanvas } from "qrcode.react"

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
    const [isQRModalOpen, setIsQRModalOpen] = useState(false)
    const [formUrl, setFormUrl] = useState("")

    useEffect(() => {
        if (typeof window !== "undefined") {
            setFormUrl(`${window.location.origin}/submit/${formId}`)
        }
    }, [formId])

    const toggleRow = (id: string) => {
        setExpandedRows(prev => ({
            ...prev,
            [id]: !prev[id]
        }))
    }

    const downloadQRCode = () => {
        const qrCanvas = document.getElementById("qr-code-canvas-download") as HTMLCanvasElement;
        if (!qrCanvas) return;

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const width = 800;
        const height = 1000;
        canvas.width = width;
        canvas.height = height;

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = "#171717";
        ctx.font = "bold 48px 'Inter', sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        
        const maxWidth = 700;
        const words = formTitle.split(' ');
        let line = '';
        let y = 100;
        
        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth && n > 0) {
                ctx.fillText(line, width / 2, y);
                line = words[n] + ' ';
                y += 60;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, width / 2, y);

        y += 80;
        ctx.fillStyle = "#525252";
        ctx.font = "28px 'Inter', sans-serif";
        ctx.fillText("Scan this QR code with your phone's camera", width / 2, y);
        ctx.fillText("to access and fill out the form.", width / 2, y + 40);

        y += 120;
        const qrSize = 400;
        const qrX = (width - qrSize) / 2;
        
        ctx.shadowColor = "rgba(0, 0, 0, 0.05)";
        ctx.shadowBlur = 20;
        ctx.shadowOffsetY = 10;
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.roundRect(qrX - 20, y - 20, qrSize + 40, qrSize + 40, 20);
        ctx.fill();
        
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;

        ctx.strokeStyle = "#e5e5e5";
        ctx.lineWidth = 2;
        ctx.strokeRect(qrX - 20, y - 20, qrSize + 40, qrSize + 40);

        ctx.drawImage(qrCanvas, qrX, y, qrSize, qrSize);

        ctx.fillStyle = "#a3a3a3";
        ctx.font = "24px 'Inter', sans-serif";
        ctx.fillText("Powered by Form.aro", width / 2, height - 80);

        const pngUrl = canvas.toDataURL("image/png", 1.0).replace("image/png", "image/octet-stream");
        const downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = `${formTitle.toLowerCase().replace(/\s+/g, '-')}-poster.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
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
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 p-8 px-4">
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
                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsQRModalOpen(true)}
                                className="inline-flex items-center justify-center rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-900 shadow-sm hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800"
                            >
                                <QrCode className="mr-2 h-4 w-4" />
                                <span className="hidden sm:block">Share QR</span>
                            </button>
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

            {isQRModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-sm rounded-xl bg-white dark:bg-neutral-900 p-6 shadow-xl border border-neutral-200 dark:border-neutral-800">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Share Form</h2>
                            <button
                                onClick={() => setIsQRModalOpen(false)}
                                className="rounded-full p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="flex flex-col items-center justify-center gap-6">
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-neutral-100">
                                <QRCodeCanvas
                                    id="qr-code-canvas"
                                    value={formUrl}
                                    size={200}
                                    level="H"
                                    includeMargin={true}
                                />
                                <div className="hidden">
                                    <QRCodeCanvas
                                        id="qr-code-canvas-download"
                                        value={formUrl}
                                        size={1000}
                                        level="H"
                                        includeMargin={true}
                                    />
                                </div>
                            </div>
                            <p className="text-sm text-center text-neutral-500 dark:text-neutral-400">
                                Scan this QR code to access and fill out the form.
                            </p>
                            <div className="w-full space-y-3">
                                <button
                                    onClick={downloadQRCode}
                                    className="w-full inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors"
                                >
                                    <Download className="mr-2 h-4 w-4" />
                                    Download QR Code
                                </button>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(formUrl);
                                        alert("Link copied to clipboard!");
                                    }}
                                    className="w-full inline-flex items-center justify-center rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 py-2 text-sm font-medium text-neutral-900 dark:text-white shadow-sm hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                                >
                                    Copy Link
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
