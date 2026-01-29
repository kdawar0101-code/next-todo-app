import { getLoggedInUser } from '@/lib/auth'
import { connectDB } from '@/lib/connectDB'
import Todo from '@/Models/todoModel'

export async function GET() {
   await connectDB()

   const user = await getLoggedInUser()
   if (user instanceof Response) return user;

   const allTodos = await Todo.find({userId: user.id })

   return Response.json(allTodos.map(({ id, text, completed }) => ({ id, text, completed })))

}

export async function POST(request) {
   await connectDB()
   const todo = await request.json()

   const user = await getLoggedInUser()

   if (user instanceof Response) return user;

   const { id, text, completed } = await Todo.create({
      text: todo.text,
      userId: user.id,
   })
   return Response.json([{ id, text, completed }])
}

