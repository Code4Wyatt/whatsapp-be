import mongoose, {Model, Document} from "mongoose";



interface Chat extends Document {
  _id: string;
  members: string;
  messages: string;
  avatar: string;
  
}



const { Schema, model } = mongoose;

const ChatSchema = new Schema<Chat>(
  {
    
    members: [{ type: String, required: true }],
    messages: [{ type: String, required: true }],
    avatar: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

export default model<Chat>("Chat", ChatSchema)