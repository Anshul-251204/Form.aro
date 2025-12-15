"use client"

import { useState, useEffect } from "react"

export function ClientSideTimestamp({ timestamp }: { timestamp: string }) {
    const [formattedDate, setFormattedDate] = useState('')

    useEffect(() => {
        const date = new Date(timestamp)
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        }
        const formatted = date.toLocaleString('en-US', options)
        setFormattedDate(formatted)
    }, [timestamp])

    return <span>{formattedDate}</span>
}