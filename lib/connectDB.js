import mongoose from "mongoose"

const DB_URI = process.env.DB_URL

export async function connectDB() {
    try {
        if(mongoose.connection.readyState === 1) {
            console.log("Already connected.");
            return
        }
        mongoose.connect(DB_URI,{
            dbName: 'NxtTodo'
        })
        console.log("DB connected")
    } catch (error) {
        console.log(error);
        console.log("DB not connected")
    }
}