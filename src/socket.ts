import { Server } from "socket.io";
import { Socket } from "socket.io";
import ChatModel from "../src/services/chats/chatSchema";
import { createServer } from "http";
import server from "../src/server";

const httpServer = createServer(server);
const io = new Server(httpServer, { /* options */ });

interface OnlineUser {
    _id: string;
    socket: Socket;
}

export let onlineUsers: OnlineUser[] = []

io.on("connection", (socket) => {
    console.log(socket.id, socket.rooms)

    socket.on("setUsername", ({ userId, room }) => {
        console.log(userId)

        socket.join(room)

        onlineUsers.push({ _id: userId, socket: socket })

        socket.emit('loggedin')
        socket.broadcast.emit('newConnection')
    })

    socket.on("sendmessage", async ({ message, room }) => {

        try {
            await ChatModel.findOneAndUpdate({ name: room }, {
                $push: { messages: message }
            })

            socket.to(room).emit("message", message)

        } catch (error) {
            socket.emit("error", { error: "Can't save to DB. Try again later." })
        }

    })
});

