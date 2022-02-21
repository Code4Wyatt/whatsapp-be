import mongoose from "mongoose";

const { Schema, model } = mongoose;

const ChatSchema = new Schema<Chat>(
  {
    _id: { type: String, required: true },
    members: [{ type: String, required: true }],
    messages: [{ type: String, required: true }],
    avatar: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export default model("Chat", ChatSchema)