interface User {
    _id: string;
    username: string;
    email: string;
    password: string
    avatar: string;
    checkCredentials: Promise<User | null>;
}

interface UserModel extends Model<User> {
    checkCredentials(): any;
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

