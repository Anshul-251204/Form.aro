
import { NextResponse } from 'next/server';
import { Agent, run } from '@openai/agents';
import { z } from 'zod';
import { auth } from '@/auth';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { getEnhancePrompt, SYSTEM_PROMPT } from './prompt';

// Define Zod schema for form structure with validation guardrails
const FormFieldSchema = z.object({
    _id: z.string().describe('Unique identifier for the field'),
    type: z.enum([
        'text',
        'long_text',
        'multiple_choice',
        'checkbox',
        'dropdown',
        'date',
        'number',
        'email'
    ]).describe('Type of form field'),
    label: z.string().min(1).describe('Question or field label'),
    options: z.array(z.string()).optional().describe('Options for multiple_choice, checkbox, or dropdown fields'),
    validation: z.object({
        required: z.boolean().default(false)
    }).optional()
});

const FormGenerationSchema = z.object({
    title: z.string().min(1).max(200).describe('Title of the form'),
    description: z.string().min(1).max(1000).describe('Description of the form'),
    fields: z.array(FormFieldSchema).min(3).max(50).describe('Array of form fields')
});

const agent = new Agent({
    name: 'FormGeneratorAgent',
    model: 'gpt-4o',
    //     instructions: `You are an AI assistant helping users build forms.
    // Based on the user's description, generate a well-structured form with appropriate fields.
    // Ensure each field has a unique _id (use short random strings like 'field_1', 'field_2', etc.).
    // Generate at least 3-5 fields based on the description.
    // For multiple_choice, checkbox, and dropdown fields, always provide relevant options.
    // Make important fields required by setting validation.required to true.`,
    instructions: SYSTEM_PROMPT,
    outputType: FormGenerationSchema
});

export async function POST(req: Request) {
    try {
        if (!process.env.OPENAI_API_KEY) {
            console.error('OPENAI_API_KEY not configured');
            return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
        }

        const session = await auth();
        if (!session || !session.user) {
            console.error('Unauthorized: No session or user');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const user = await User.findById(session.user.id);
        if (!user) {
            console.error('User not found:', session.user.id);
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const today = new Date();
        const lastUsed = user.aiDetails?.lastUsed ? new Date(user.aiDetails.lastUsed) : null;

        // Check if it's a new day (simple UTC date comparison)
        const isNewDay = !lastUsed ||
            lastUsed.getUTCFullYear() !== today.getUTCFullYear() ||
            lastUsed.getUTCMonth() !== today.getUTCMonth() ||
            lastUsed.getUTCDate() !== today.getUTCDate();

        let currentCount = user.aiDetails?.count || 0;

        if (isNewDay) {
            currentCount = 0;
        }

        if (currentCount >= Number(process.env.AI_GENERATION_LIMIT || 100)) {
            return NextResponse.json({
                error: 'Daily limit reached',
                message: `You have reached your daily limit of ${process.env.AI_GENERATION_LIMIT} AI form generations. Please try again tomorrow.`
            }, { status: 429 });
        }

        const { prompt, currentForm } = await req.json();

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        console.log('Generating form with prompt:', prompt);

        // Dynamic instructions based on whether we are improving or creating
        let instructions = agent.instructions;

        if (currentForm) {
            console.log('Improving existing form:', currentForm.currentTitle);
//             instructions = `You are an AI assistant helping users IMPROVE an existing form.
// Current Form Context:
// Title: ${currentForm.currentTitle}
// Description: ${currentForm.currentDescription}
// Fields: ${JSON.stringify(currentForm.currentFields)}

// User Request: ${prompt}

// Based on the user's request and the current form, generate an IMPROVED version of the form.
// 1. MODIFY, ADD, or REMOVE fields as requested.
// 2. KEEP existing fields unless explicitly asked to remove or change them.
// 3. PRESERVE the existing _id's for fields that are unchanged or slightly modified.
// 4. Generate NEW unique _id's for NEW fields.
// 5. Return the COMPLETE form structure (merged result).`;
            instructions = getEnhancePrompt(currentForm,prompt);
        }

        // Create a temporary agent with dynamic instructions if needed, or use the base agent
        // Since Agent properties might be read-only or shared, we should ideally instantiate a fresh one or pass instructions to run() if supported.
        // The @openai/agents SDK 'run' function takes an agent. We can create a new instance for this run if instructions change.

        const effectiveAgent = currentForm ? new Agent({
            name: 'FormImproverAgent',
            model: 'gpt-4o',
            instructions: instructions,
            outputType: FormGenerationSchema
        }) : agent;

        // Use Agent SDK to generate structured form data with guardrails
        const result = await run(effectiveAgent, prompt);

        const formData = result.finalOutput;

        console.log("formData", formData);

        // Update user usage
        await User.findByIdAndUpdate(user._id, {
            $set: {
                'aiDetails.count': currentCount + 1,
                'aiDetails.lastUsed': new Date()
            }
        });

        return NextResponse.json(formData);
    } catch (error) {
        console.error('AI generation error:', error);
        // Return a proper JSON error response
        return NextResponse.json({
            error: 'Failed to generate form',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
