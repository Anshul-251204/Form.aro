import mongoose from "mongoose";

const FormSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, default: "Untitled Form" },
    description: { type: String, default: "" },
    published: { type: Boolean, default: false },
    fields: { type: Array, default: [] },
    views: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Form || mongoose.model("Form", FormSchema);
