import connectDB from "@/lib/db"
import Setting from "@/model/setting.model"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
    try {
        const { ownerId } = await req.json()

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
        const seting = await Setting.findOne(
            { ownerId }
        )

        return NextResponse.json(seting)
    } catch (error) {
        return NextResponse.json(
            {
                message: `get settings error ${error}`
            },
            {
                status: 500
            }
        )
    }
}