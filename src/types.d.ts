interface User {
    _id: String;
    username: String;
    email: String;
    avatar: String;
    checkCredentials: Promise<User | null>;
}

interface Chat {
    _id: String;
    members: User[];
    messages: Message[];
    avatar: String;
}

interface Message {
    _id: String;
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

