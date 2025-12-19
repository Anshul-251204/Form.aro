import NextAuth from "next-auth"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import { getMongoClientPromise } from "@/lib/mongodb";
import { authConfig } from "@/auth.config"
import Credentials from "next-auth/providers/credentials"
import { connectDB } from "@/lib/db"
import User from "@/models/User"

const mongoClientPromise = getMongoClientPromise();
const isDbAvailable = !!mongoClientPromise;

export const { handlers, signIn, signOut, auth } = NextAuth({
    // 🔑 adapter ONLY if DB is available
    adapter: isDbAvailable
    ? MongoDBAdapter(mongoClientPromise!)
    : undefined,
    ...authConfig,
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            authorize: async (credentials) => {
                if (!credentials?.email) return null

                await connectDB()

                const email = credentials.email as string
                let user = await User.findOne({ email })

                if (!user) {
                    user = await User.create({
                        email,
                        name: email.split('@')[0],
                        image: "",
                        emailVerified: new Date(),
                    })
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
})
