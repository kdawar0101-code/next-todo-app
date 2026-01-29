import { cookies } from "next/headers";

const { getSessionId } = require("@/lib/auth");
const { default: Session } = require("@/Models/sessionModel");

export async function POST() {
    const cookieStore = await cookies()
    const sessionID = await getSessionId()

    await Session.findByIdAndDelete(sessionID)
    cookieStore.delete('userId')
    return new Response(null, {
        status:204,
    })
}