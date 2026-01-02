import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/providers/toast-provider";
import { AuthProvider } from "@/providers/AuthProvider";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata = {
    title: "Form.aro",
    keywords: [
        "form aro",
        "formaro",
        "form.aro",
        "form aro app",
        "formaro app",
        "form builder",
        "ai form builder",
        "ai form generator",
        "google forms alternative",
        "google form alternative free",
        "online form builder",
        "form generator",
        "survey builder",
        "survey creator",
        "create forms online",
        "no code form builder",
        "form analytics",
        "response analytics",
        "form submission dashboard"
    ],

    applicationName: "Form.aro",

    openGraph: {
        title: "Form.aro — AI Form Builder & Google Forms Alternative",
        description:
            "Create forms and surveys instantly using AI. Form.aro helps you generate forms, collect responses, export data and view analytics — free and fast.",
        url: "https://form-aro.vercel.app",
        siteName: "Form.aro",
        type: "website",
        locale: "en_IN",
    },

    twitter: {
        card: "summary_large_image",
        title: "Form.aro — AI Form Builder",
        description:
            "Generate forms & surveys instantly using AI. A modern Google Forms alternative with response analytics & export support.",
    },

    category: "productivity",

    alternates: {
        canonical: "https://form-aro.vercel.app",
    },
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
                <AuthProvider>
                    <ToastProvider>
                        {children}
                    </ToastProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
