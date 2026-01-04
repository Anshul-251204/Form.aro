import { DashboardHeader } from "@/components/DashboardHeader"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-neutral-950">
            <DashboardHeader />
            <main className="">
                {children}
            </main>
        </div>
    )
}
