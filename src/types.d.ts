interface User {
    _id: string;
    username: string;
    email: string;
    avatar: string;
    checkCredentials: Promise<User | null>;
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
    sender: string[];
    content: Text & Media;
}

interface Text {
   text: string
}

interface Media {
   text: string
}

