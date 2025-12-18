import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { connectDB } from "@/lib/db"
import Form from "@/models/Form"

export async function GET() {
    const session = await auth()
    if (!session?.user?.id) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    await connectDB()
    const forms = await Form.find({ userId: session.user.id }).sort({ createdAt: -1 })

    // Serialize to plain objects
    const serializedForms = forms.map(f => ({
        ...f.toObject(),
        id: f._id.toString(),
        _id: f._id.toString(),
        createdAt: f.createdAt.toISOString(),
        updatedAt: f.updatedAt.toISOString(),
    }))

    return NextResponse.json(serializedForms)
}

export async function POST(request: Request) {
    const session = await auth()
    if (!session?.user?.id) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const body = await request.json()
        await connectDB()

        const form = await Form.create({
            userId: session.user.id,
            title: body.title || "Untitled Form",
            description: body.description || "",
            fields: body.fields || [],
            published: false,
            views: 0,
            responses: 0
        })

        return NextResponse.json({
            ...form.toObject(),
            id: form._id.toString(),
            _id: form._id.toString()
        })
    } catch (error) {
        console.error("Failed to create form", error)
        return new NextResponse("Error creating form", { status: 500 })
    }
}
