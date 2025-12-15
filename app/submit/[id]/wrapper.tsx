"use client"

import { FormRenderer } from "@/components/FormRenderer"
import { useEffect, useRef } from "react"

export function SubmitFormWrapper({ form }: { form: any }) {
    const hasViewed = useRef(false)

    useEffect(() => {
        if (hasViewed.current) return
        hasViewed.current = true

        fetch(`/api/forms/${form.id}/view`, { method: 'POST' })
            .catch(err => console.error('Failed to increment view', err))
    }, [form.id])

    const handleSubmit = async (data: any) => {
        const res = await fetch(`/api/submit/${form.id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        })

        if (!res.ok) {
            throw new Error('Submission failed')
        }
    }

    // Map prisma fields to FormField type expected by renderer
    const fields = form.fields.map((f: any) => ({
        id: f.id,
        type: f.type,
        label: f.label,
        required: f.required,
        validation: f.validation,
        options: f.options,
    }))

    return (
        <FormRenderer
            title={form.title}
            description={form.description || ""}
            fields={fields}
            onSubmit={handleSubmit}
        />
    )
}
