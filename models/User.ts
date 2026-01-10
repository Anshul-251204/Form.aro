import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: { type: String, select: false },
    emailVerified: Date,
    image: String,
    aiDetails: {
        count: { type: Number, default: 0 },
        limit: { type: Number, default: 3 },
        lastUsed: { type: Date }
    }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);
