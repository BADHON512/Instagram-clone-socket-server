import express from "express"
import { Server } from "socket.io";
import { createServer } from "http";

createServer

const port=5000;
const app=express();

const server= createServer(app)

const io =new Server(server)


io.on("connection",(socket)=>{
console.log("user connected",socket.id)
socket.on("message",(data)=>{
io.emit("message:received",data)
})
socket.on("disconnect",()=>{
console.log("user disconnected",socket.id)
})
})

app.get("/",(req,res)=>{
res.send("hello world")
})
app.listen(port,()=>{
console.log(`server is running on port ${port}`)
})