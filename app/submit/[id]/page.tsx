import { notFound } from "next/navigation"
import { connectDB } from "@/lib/db"
import Form from "@/models/Form"
import { SubmitFormWrapper } from "./wrapper"
import { Lock } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function SubmitPage({ params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        await connectDB()

        const form = await Form.findById(id).lean()
        if (!form) {
            return notFound()
        }

        if (!form.published) {
            return (
                <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col items-center justify-center p-4 text-center">
                    <div className="bg-white dark:bg-neutral-900 p-8 rounded-xl border border-neutral-200 dark:border-neutral-800 max-w-md w-full shadow-sm">
                        <div className="mx-auto w-12 h-12 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-4">
                            <Lock className="h-6 w-6 text-neutral-500 dark:text-neutral-400" />
                        </div>
                        <h1 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">Form Not Available</h1>
                        <p className="text-neutral-500 dark:text-neutral-400 mb-6">
                            This form is currently not accepting responses. It may have been unpublished or deleted by the owner.
                        </p>
                        <p className="text-xs text-neutral-400 dark:text-neutral-500">
                            Form ID: {id}
                        </p>
                    </div>
                </div>
            )
        }

        // Fix serialization issues for Client Component
        // Mongoose objects (like Buffer from UUIDs, ObjectIds) need to be plain JSON
        const serializedForm = JSON.parse(JSON.stringify(form))

        return (
            <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 p-4 sm:p-8">
                <div className="max-w-3xl mx-auto">
                    <SubmitFormWrapper form={serializedForm} />
                </div>
            </div>
        )
    } catch (error) {
        notFound()
    }
}
