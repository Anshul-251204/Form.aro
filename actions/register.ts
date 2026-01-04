"use server";

import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { z } from "zod";

const registerSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
    name: z.string().min(3, { message: "Name must be at least 3 characters long" }),
});

export async function registerUser(formData: FormData) {
    const email = formData.get("email");
    const password = formData.get("password");
    const name = formData.get("name");

    const validatedFields = registerSchema.safeParse({
        email,
        password,
        name
    });

    if (!validatedFields.success) {
        return {
            error: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { email: validEmail, password: validPassword, name: validName } = validatedFields.data;

    try {
        await connectDB();

        const existingUser = await User.findOne({ email: validEmail });

        if (existingUser) {
            return { msg: "User already exists", status: 400 };
        }

        const hashedPassword = await bcrypt.hash(validPassword, 10);

        await User.create({
            email: validEmail,
            name: validName || validEmail.split("@")[0],
            password: hashedPassword,
        });

        return { msg: "User registered successfully", status: 201 };
    } catch (error) {
        console.log(error);
        return { msg: "Something went wrong", status: 500 };
    }
}
