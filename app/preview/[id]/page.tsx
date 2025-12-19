"use client"

import { FormRenderer } from "@/components/FormRenderer"
import { useFormEditorStore } from "@/store/form-editor"
import { useEffect, useState } from "react"

export default function PreviewPage() {
    const { fields } = useFormEditorStore()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <div className="min-h-screen bg-blue-50/50 dark:bg-neutral-950 py-8">
            <FormRenderer
                title="Untitled Form"
                description="This is a preview of your form."
                fields={fields}
                isPreview={true}
            />
        </div>
    )
}
