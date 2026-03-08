import Setting from "@/model/setting.model";
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import connectDB from "@/lib/db";

export async function POST(req: NextRequest) {
    try {
        const { message, ownerId } = await req.json()
        if (!message || !ownerId) {
            return NextResponse.json(
                {
                    message: "message and ownerId is required"
                },
                {
                    status: 400
                }
            )
        }

        await connectDB()
        const setting = await Setting.findOne({ ownerId })
        if (!setting) {
            return NextResponse.json(
                {
                    message: "chatbot is not configured yet"
                },
                {   
                    status: 400
                }
            )
        }

        const KNOWLEDGE = `
        business name - ${setting.businessName || "not provided"}
        support email - ${setting.supportEmail || "not provided"}
        knowledge - ${setting.knowledge || "not provided"}
        `

        const prompt = `
You are a professional customer support assistant for this business.

Use ONLY the information provided below to answer the customer's question.
You may rephrase, summarize, or interpret the information if needed.

IMPORTANT RULES:
- Do NOT use bullet points (**, *, -, •).
- Do use bullet points (-, •).
- Do NOT use markdown formatting.
- If listing items, put each item on a new line.
- Do NOT write in paragraph form.
- Keep the answer clean and simple.

Do NOT invent new policies, prices, or promises.

If the customer's question is completely unrelated to the information,
or cannot be reasonably answered from it, reply exactly with:

“Please contact support.”

--------------------
BUSINESS INFORMATION
--------------------
${KNOWLEDGE}

-----------------
CUSTOMER QUESTION
-----------------
${message}

----------------
ANSWER
----------------
`;
        const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});
        const res = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        const response = NextResponse.json(res.text)

        response.headers.set("Access-Control-Allow-Origin", "*")
        response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS")
        response.headers.set("Access-Control-Allow-Headers", "Content-Type")

        return response

    } catch (error) {
        const response = NextResponse.json(
            {
                message: `chat error ${error}`
            },
            {
                status: 500
            }
        )

        response.headers.set("Access-Control-Allow-Origin", "*")
        response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS")
        response.headers.set("Access-Control-Allow-Headers", "Content-Type")

        return response
    }
}

export const OPTIONS = async () => {
    return NextResponse.json(null, {
        status: 201,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        }
    })
}