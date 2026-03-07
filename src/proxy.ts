import { NextRequest } from "next/server";
import { getSession } from "./lib/getSession";

export async function proxy(req: NextRequest) {
    const session = await getSession()
    console.log(session)
}

export const config = {
    matcher: "/dashboard/:path*"
}