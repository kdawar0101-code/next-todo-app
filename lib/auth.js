import Session from "@/Models/sessionModel"
import User from "@/Models/userModel"
import { createHmac } from "crypto"
import { cookies } from "next/headers"

export async function getLoggedInUser() {
     const cookieStore = await cookies()

 const cookie = cookieStore.get('userId')?.value

 if(!cookie){
   return Response.json({error: "Please login"}, {
      status: 401,
   })
 }

const sessionId = verifySignature(cookie)

 const session = await Session.findById(sessionId)

  if(!session) {
   return Response.json({error: "Please login"}, {
      status: 401,
   })
}

const activeSessionsCount = await Session.countDocuments({
  userId: session.userId,
})

if (activeSessionsCount > process.env.MAX_SESSIONS) {

  await Session.deleteOne({_id : session.id})

  return Response.json(
  { error: "Maximum active sessions reached" },
  { status: 429 }
)
}

const user = await User.findById(session.userId).select('-password -__v')

 return user
}

export async function getSessionId() {
  const cookieStore = await cookies()

 const cookie = cookieStore.get('userId')?.value
 const sessionId = verifySignature(cookie)
 return sessionId
}

export function createSignature(cookie) {
    const signature = createHmac("sha256", process.env.SUPER_SECRET_KEY).update(cookie).digest('hex')
   return `${cookie}.${signature}`
}

export function verifySignature(SignedCookie) {
 const [cookie, cookieSignature] = SignedCookie.split(".")
 const signature = createSignature(cookie).split('.')[1]

 if(signature === cookieSignature) {
  return cookie
 }else{
  return false;
 }
}