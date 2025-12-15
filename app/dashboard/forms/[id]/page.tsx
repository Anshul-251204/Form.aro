import { notFound } from "next/navigation"
import { connectDB } from "@/lib/db"
import Form from "@/models/Form"
import Submission from "@/models/Submission"
import { SubmissionsView } from "./submissions-view"
import { auth } from "@/auth"

export const dynamic = 'force-dynamic'

export default async function SubmissionsPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await auth()
    if (!session?.user) {
        return notFound()
    }

    const { id } = await params

    await connectDB()

    // Fetch form to verify ownership and get title
    const form = await Form.findOne({ _id: id, userId: session.user.id }).lean()
    console.log(form)
    if (!form) {
        return notFound()
    }

    // Fetch submissions
    const submissions = await Submission.find({ formId: id }).sort({ createdAt: -1 }).lean()

    // Serialize data
    const serializedSubmissions = submissions.map(sub => ({
        id: sub._id.toString(),
        submittedAt: (sub as any).createdAt.toISOString(),
        data: sub.data,
    }))

    return (
        <SubmissionsView
            formId={id}
            formTitle={form.title}
            fields={form.fields}
            submissions={serializedSubmissions}
            views={form.views || 0}
        />
    )
}
