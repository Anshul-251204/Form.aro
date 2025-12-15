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
    const forms = await Form.find({ userId: session.user.id }).sort({ createdAt: -1 }).lean()

    const serializedForms = forms.map(f => ({
        ...f,
        id: f._id.toString(),
    }))

    return NextResponse.json(serializedForms)
}

export async function POST(request: Request) {
    const session = await auth()
    if (!session?.user?.id) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    await connectDB()
    const body = await request.json()
    const newForm = await Form.create({
        userId: session.user.id,
        title: body.title || "Untitled Form",
        description: body.description || "",
        published: false,
    })

    return NextResponse.json({ ...newForm.toObject(), id: newForm._id.toString() })
}
