import { NextResponse } from "next/server"
import {connectDB} from "@/lib/db"
import Form from "@/models/Form"
import Submission from "@/models/Submission"

export async function POST(request: Request, { params }: { params: Promise<{ formId: string }> }) {
    const { formId } = await params

    try {
        await connectDB()
        const form = await Form.findById(formId)

        if (!form) {
            return new NextResponse("Form not found", { status: 404 })
        }

        if (!form.published) {
            return new NextResponse("Form is not published", { status: 403 })
        }

        const body = await request.json()

        const submission = await Submission.create({
            formId: formId,
            data: body,
        })

        return NextResponse.json(submission)
    } catch (error) {
        console.error("Submission error:", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
