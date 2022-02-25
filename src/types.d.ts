import { Socket } from "socket.io";

interface User {
    _id: string;
    username: string;
    email: string;
    password: string
    avatar: string;
}
interface OnlineUser {
    _id: string;
    socket: Socket;
}


interface Chat {
    _id: string;
    members: User[];
    messages: Message[];
    avatar: string;
}

interface Message {
    _id: string;
    timestamp: number;
    sender: User;
    content: Text & Media;
}

interface Text {
   text: string
}

interface Media {
   text: string
}

interface Headers {
    authorization: string
}

interface Request {
    user: string
}

namespace Express {
    interface User {
        _id?: string
        tokens?: {
            accessToken: string;
            refreshToken: string;
        }
    }
}
