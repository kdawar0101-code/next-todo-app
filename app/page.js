"use client"

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react"
import { MdOutlineDelete } from "react-icons/md";
import { MdOutlineEdit } from "react-icons/md";
import { FaUserLarge } from "react-icons/fa6";

export default function Home() {

  const [todos, setTodos] = useState([])
  const [text, setText] = useState('')
  const [user, setUser] = useState({})
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    fetchTodos()
    fetchUser()
  }, [])

  const inputRef = useRef(null)
  const router = useRouter()
  
  async function fetchTodos() {
    const response = await fetch('api/todos')
    const data = await response.json()
    console.log(data);
   
    if(response.status === 401 || response.status === 429){
     return router.push("/login")
    }

        setTodos(data)
  }

  async function fetchUser() {
    const response = await fetch('api/user')
    const data = await response.json()
   
    if(response.status === 401){
     return router.push("/login")
    }

    setUser(data)
  }


  async function postTodos() {
    if (!text.trim()) return // prevent empty todos

    await fetch("api/todos", {
      method: "POST",
      body: JSON.stringify({ text }),
    })

    setText("")
    fetchTodos() // refresh list
  }

  async function updateTodos(id, text) {
    const response = await fetch(`api/todos/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ text: text })
    })

    if (response.status === 201) {
      fetchTodos()
    }
  }

  async function DeleteTodos(id) {
    const response = await fetch(`api/todos/${id}`, {
      method: "DELETE",
    })

    if (response.ok) {
      fetchTodos()
    }
  }

  async function toggleTodo(id) {
    const todo = todos.find((todo) => todo.id === id)
    const response = await fetch(`api/todos/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ completed: !todo.completed })
    })

    if (response.status === 200) {
      fetchTodos()
    }
  }

  return (
    <div className="flex flex-col items-center pt-20 gap-12 px-4 py-7">
      <div className="flex items-center gap-2">
        <FaUserLarge className="text-2xl" />
        <p className="text-2xl font-bold">{user.name}</p>
      </div>
      <div className="border-amber-950 border-2 rounded-xl w-full max-w-xl flex justify-between px-3">
        <input
          onChange={(e) => {
            e.stopPropagation()
            const text = e.target.value
            setText(text)
          }}

          onKeyUp={(e) => {
            if (e.key === 'Enter') postTodos()
          }}

          value={text}
          type="text"
          placeholder="Enter a todo"
          className="w-full px-4 py-2 focus:outline-none rounded-xl"
        />
        <button onClick={(e) => {
          e.stopPropagation()
          postTodos()
        }}
          className={`border my-3 px-2 rounded bg-gray-500 invert ${!text.trim() ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>+</button>
      </div>
      <ul className="flex flex-col gap-4 text-center w-full max-w-xl">
        {[...todos].reverse().map((todo) => (
          <li
            key={todo.id}
            className="border rounded  break-words flex justify-between items-center gap-4 px-2"
          >
            <div className={`border w-4 h-4 rounded cursor-pointer text-black flex items-center font-bold ${todo.completed ? 'bg-white' : ''}`} onClick={(e) => {
              e.stopPropagation()
              toggleTodo(todo.id)
            }}>{todo.completed ? '✓' : ''}</div>
            <input ref={editingId === todo.id ? inputRef : null}
              disabled={editingId !== todo.id}
              className={`w-full focus:outline-none py-2 px-2 ${todo.completed ? 'line-through' : ''}`}
              onChange={(e) => {
                const newText = e.target.value

                if (!todo.completed) {
                  setTodos((prevTodos) =>
                    prevTodos.map((t) =>
                      t.id === todo.id ? { ...t, text: newText } : t
                    )
                  )
                }
              }}

              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  updateTodos(todo.id, todo.text)
                  setEditingId(null)
                }

                if (e.key === 'Escape') {
                  fetchTodos() // revert changes
                  setEditingId(null)
                }
              }}

              type="text"
              value={todo.text}

            />
            <button
              onClick={() => {
                setEditingId(todo.id)
                setTimeout(() => {
                  inputRef.current?.focus()
                }, 0)
              }}
              className={` text-green-500 text-xl ${todo.completed ? 'text-green-600 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <MdOutlineEdit />
            </button>


            <button onClick={(e) => {
              e.stopPropagation()
              DeleteTodos(todo.id)
            }}
              className="cursor-pointer text-red-600 text-xl"
            > <MdOutlineDelete /></button>
          </li>
        ))}
      </ul>
    </div>

  )
}
