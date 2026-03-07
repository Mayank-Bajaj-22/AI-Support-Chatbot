import connectDB from "@/lib/db"
import Setting from "@/model/setting.model"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
    try {
        const { ownerId, businessName, supportEmail, knowledge } = await req.json()

        if (ownerId) {
            return NextResponse.json(
                {
                    message: "owner id is required"
                },
                {
                    status: 400
                }
            )
        }

        await connectDB()
        const setings = await Setting.findOneAndUpdate(
            { ownerId },
            { ownerId, businessName, supportEmail, knowledge },
            { new: true, upsert: true }
        )

        return NextResponse.json(setings)
    } catch (error) {
        return NextResponse.json(
            {
                message: `settings error ${error}`
            },
            {
                status: 500
            }
        )
    }
}
