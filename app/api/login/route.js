import { connectDB } from "@/lib/connectDB"
import User from "@/Models/userModel"
import { cookies } from "next/headers"
import Session from "@/Models/sessionModel"
import { createSignature } from "@/lib/auth"
import bcrypt from "bcrypt"

export async function POST(request) {
    await connectDB()
    const cookieStore = await cookies()
    const {email , password} = await request.json()
    try {

        
    const user = await User.findOne({email: email})

    if(!user){
        return Response.json({error: "Invalid credentials"}, {
            status: 400
        })
    }

   const isPasswordValid = await bcrypt.compare(password, user.password)

    if(!isPasswordValid){
        return Response.json({error: "Invalid credentials"}, {
            status: 400
        })
    }
    
const session = await Session.create({userId: user._id})

     cookieStore.set("userId", createSignature(session.id), {
        httpOnly: true,
        maxAge: 60 * 60,
     })

      return Response.json({name: user.name, email: user.email},{
        status: 201
      })
    
    } catch (error) {
        console.log(error);
       return Response.json({error: "Something went wrong"}, {
            status: 400
        })
    }
}