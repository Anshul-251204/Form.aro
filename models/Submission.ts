import mongoose from "mongoose";

const SubmissionSchema = new mongoose.Schema({
    formId: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true },
    data: { type: Object, required: true },
}, { timestamps: true });

export default mongoose.models.Submission || mongoose.model("Submission", SubmissionSchema);
