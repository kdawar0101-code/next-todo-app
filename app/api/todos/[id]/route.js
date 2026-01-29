import { getLoggedInUser } from '@/lib/auth';
import { connectDB } from '@/lib/connectDB';
import Todo from '@/Models/todoModel';


export async function GET(_,{params}) {
    await connectDB()
    const user = await getLoggedInUser()
    if(user instanceof Response) return user;

    const {id} = await params
    const todo = await Todo.findOne({_id: id, userId: user.id})
    if (!todo) {
        return Response.json({error: "Not found"})
    }
    return Response.json(todo)
}


export async function PUT(request, { params }) {
    await connectDB()
    const user = await getLoggedInUser()
    if(user instanceof Response) return user;

  const { id } = await params
  const updateTodo = await request.json()

  const updatedTodo = await Todo.updateOne({_id: id, userId: user.id}, updateTodo, {
    new: true,
    // runValidators: true || Used when we have to validate the required fields.
  })
  return Response.json(updatedTodo)
}


export async function DELETE(_,{params}) {
    await connectDB()
       const user = await getLoggedInUser()
    if(user instanceof Response) return user;

    const {id} = await params
     const todo = await Todo.deleteOne({_id: id, userId: user.id});
    if (!todo) {
        return Response.json({error: "Not found"})
    }
    return new Response(null,{
        status:204
    })
}
