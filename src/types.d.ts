interface User {
    username: String;
    email: String;
    avatar: String;
    checkCredentials: Promise<User | null>;
}

interface Chat {
    members: User[];
    messages: Message[];
    avatar: String;
}

interface Message {
    timestamp: Number;
    sender: String[];
    content: Text & Media;
}

interface Text {
   text: String
}

interface Media {
   text: String
}

