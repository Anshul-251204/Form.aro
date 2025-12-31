import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const authConfig = {
    session: { strategy: "jwt" },
    pages: {
        signIn: "/login",
    },
    providers: [],
    callbacks: {
        async session({ session, token }) {
            if (session.user && token.sub) {
                session.user.id = token.sub
            }
            return session
        },
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')
            const isOnBuilder = nextUrl.pathname.startsWith('/builder')
            const isApiRoute = nextUrl.pathname.startsWith('/api')

            // Don't apply redirect logic to API routes - they handle auth internally
            if (isApiRoute) {
                return true
            }

            if (isOnDashboard || isOnBuilder) {
                if (isLoggedIn) return true
                return false // Redirect unauthenticated users to login page
            }
            return true
        },
    }
} satisfies NextAuthConfig
