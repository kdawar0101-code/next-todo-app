import { connectDB } from "@/lib/connectDB";
import bcrypt from "bcrypt";

const { default: User } = require("@/Models/userModel")

export async function POST(request) {
    await connectDB()
    const user = await request.json()

    try {

        const { name, email, password } = user
        const hashedPassword = await bcrypt.hash(password, 10)
        await User.create({name, email, password: hashedPassword})
        return Response.json({name, email},
            { status: 201 }
        )
    } catch (error) {
        return Response.json({ error: "Email already exists." },
            { status: 409 }
        )
    }
}