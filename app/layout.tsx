import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/providers/toast-provider";
import { SessionProvider } from "next-auth/react";
const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Form.aro",
    description: "Form.aro - The best form builder",
};
export function Icon() {
    return <link rel="icon" href="/form.aro-logo.png" type="image/png" sizes="32x32" />
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <SessionProvider>
                    <ToastProvider>
                        {children}
                    </ToastProvider>
                </SessionProvider>
            </body>
        </html>
    );
}
