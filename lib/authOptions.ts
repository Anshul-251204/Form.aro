import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { connectDB } from "@/lib/db"
import User from "@/models/User"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
    providers: [
        ...(process.env.GOOGLE_AUTH_ON === "true" && process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [
            GoogleProvider({
                clientId: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            })
        ] : []),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Invalid credentials")
                }

                await connectDB()

                const user = await User.findOne({ email: credentials.email }).select("+password");

                if (!user) {
                    throw new Error("No account exists with this email")
                }

                if (!user.password) {
                    throw new Error("Invalid password")
                }

                const passwordsMatch = await bcrypt.compare(credentials.password, user.password)

                if (!passwordsMatch) {
                    throw new Error("Incorrect password")
                }

                return {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    image: user.image,
                }
            }
        })
    ],
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
        error: "/login",
    },
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === "google") {
                try {
                    await connectDB();
                    const existingUser = await User.findOne({ email: user.email });

                    if (!existingUser) {
                        await User.create({
                            name: user.name,
                            email: user.email,
                            image: user.image,
                            aiDetails: {
                                count: 0,
                                lastUsed: new Date()
                            }
                        });
                    }
                    return true;
                } catch (error) {
                    console.log("Error checking if user exists: ", error);
                    return false;
                }
            }
            return true;
        },
        async session({ session, token }) {
            if (session.user && token.sub) {
                session.user.id = token.sub
            }
            // Fetch aiDetails to keep session in sync with latest DB state
            if (token.sub) {
                try {
                    await connectDB();
                    const u = await User.findById(token.sub);
                    console.log(u.aiDetails.limit, "limit")
                    if (u) {
                        session.user.aiDetails = {
                            count: u.aiDetails?.count || 0,
                            limit: u.aiDetails?.limit || 3
                        }
                    }
                } catch (e) {
                    console.error("Error fetching user details in session", e);
                }
            }
            return session
        },
        async jwt({ token, user, account }) {
            if (user) {
                token.sub = user.id
            }
            // For google login, we might want to ensure we have the ID from DB
            if (account?.provider === "google") {
                // If it's a fresh sign in, user object comes from provider
                // But we want the database ID.
                // The signIn callback runs BEFORE jwt callback.
                // However, the `user` object in jwt callback for the first time *might* be the provider user object,
                // or the object returned from `authorize`.
                // For OAuth, `user` is the profile from the provider.
                // We need to fetch the DB user to get the real _id if we want that consistency.

                // Optimization: We can just fetch it here or rely on finding it by email if needed,
                // but usually the token.sub for OAuth is the Provider's ID (sub).
                // If we want our internal DB ID in the token, we need to fetch it.

                await connectDB();
                const dbUser = await User.findOne({ email: token.email });
                if (dbUser) {
                    token.sub = dbUser._id.toString();
                }
            }
            return token
        }
    }
}
