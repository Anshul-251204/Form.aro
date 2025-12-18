import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { connectDB } from "@/lib/db"
import Form from "@/models/Form"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth()
    if (!session?.user?.id) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    const { id } = await params

    console.log("id", id)
    await connectDB()

    try {
        const form = await Form.findOne({ _id: id, userId: session.user.id }).lean()
        if (!form) {
            return new NextResponse("Form not found", { status: 404 })
        }
        return NextResponse.json({ ...form, id: form._id.toString() })
    } catch (error) {
        return new NextResponse("Invalid ID", { status: 400 })
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth()
    if (!session?.user?.id) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    await connectDB()

    try {
        const form = await Form.findOneAndUpdate(
            { _id: id, userId: session.user.id },
            { $set: body },
            { new: true }
        ).lean()

        if (!form) {
            return new NextResponse("Form not found", { status: 404 })
        }

        return NextResponse.json({ ...form, id: form._id.toString() })
    } catch (error) {
        return new NextResponse("Error updating form", { status: 500 })
    }
}
