import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/authOptions"
import { connectDB } from "@/lib/db"
import User from "@/models/User"

export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await connectDB()
        const user = await User.findById(session.user.id).select("aiDetails")

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        return NextResponse.json({
            count: user.aiDetails?.count || 0,
            limit: user.aiDetails?.limit || 3
        })

    } catch (error) {
        console.error("Error fetching credits:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
