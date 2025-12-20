import NextAuth, { CredentialsSignin } from "next-auth"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import { getMongoClientPromise } from "@/lib/mongodb";
import { authConfig } from "@/auth.config"
import Credentials from "next-auth/providers/credentials"
import { connectDB } from "@/lib/db"
import User from "@/models/User"
import bcrypt from "bcryptjs"
import { z } from "zod"

const mongoClientPromise = getMongoClientPromise();
const isDbAvailable = !!mongoClientPromise;

const loginSchema = z.object({
    email: z.email({
        message: "Invalid email"
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters long"
    }),
})

class UserNotFoundError extends CredentialsSignin {
    code = "UserNotFound"
}

class InvalidPasswordError extends CredentialsSignin {
    code = "InvalidPassword"
}

class DateValidationFailedError extends CredentialsSignin {
    constructor(code: string) {
        super(code);
        this.code = code;
    }
}

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
                const validatedFields = loginSchema.safeParse(credentials)
                if (!validatedFields.success) {
                    throw new DateValidationFailedError(validatedFields.error.issues[0].message)
                }

                const { email, password } = validatedFields.data

                await connectDB()

                const user = await User.findOne({ email }).select("+password");


                if (!user) {
                    throw new UserNotFoundError()
                }

                if (!user.password) {
                    // User exists but has no password (likely OAuth)
                    throw new InvalidPasswordError()
                }

                const passwordsMatch = await bcrypt.compare(password, user.password)

                if (!passwordsMatch) {
                    throw new InvalidPasswordError()
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
