import { NextResponse } from "next/server";
import crypto from "crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            planId // "basic" | "pro" | "enterprise"
        } = await req.json();

        console.log(razorpay_order_id, razorpay_payment_id, razorpay_signature, planId);
        // 1. Verify Signature
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (!isAuthentic) {
            return NextResponse.json(
                { error: "Invalid signature" },
                { status: 400 }
            );
        }

        // 2. Define credits based on plan
        let creditsToAdd = 0;
        if (planId === "basic") creditsToAdd = 10;
        else if (planId === "pro") creditsToAdd = 20;
        else if (planId === "enterprise") creditsToAdd = 40;

        if (creditsToAdd === 0) {
            return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
        }

        // 3. Update User Limit
        await connectDB();
        await User.findByIdAndUpdate(session.user.id, {
            $inc: { "aiDetails.limit": creditsToAdd }
        });

        return NextResponse.json({ success: true, message: "Payment verified and credits added" });

    } catch (error) {
        console.error("Error verifying payment:", error);
        return NextResponse.json(
            { error: "Error verifying payment" },
            { status: 500 }
        );
    }
}
