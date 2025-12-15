import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import Form from "@/models/Form"

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    try {
        await connectDB()

        const form = await Form.findByIdAndUpdate(
            id,
            { $inc: { views: 1 } },
            { new: true }
        ).lean()

        if (!form) {
            return new NextResponse("Form not found", { status: 404 })
        }

        return NextResponse.json({ views: form.views })
    } catch (error) {
        console.error("Error incrementing views:", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
