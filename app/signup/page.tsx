import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"
import { redirect } from "next/navigation"
import { SignupForm } from "./signup-form"
import { Suspense } from "react"

export default async function SignupPage() {
    const session = await getServerSession(authOptions)

    if (session) {
        redirect("/dashboard")
    }

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col items-center justify-center p-4">
            <Suspense fallback={<div className="animate-pulse bg-white dark:bg-neutral-900 w-full max-w-md h-96 rounded-2xl"></div>}>
                <SignupForm />
            </Suspense>
        </div>
    )
}
