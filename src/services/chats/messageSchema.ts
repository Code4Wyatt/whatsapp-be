import mongoose from "mongoose";

const { Schema, model } = mongoose;

const MessageSchema = new Schema<Message>(
  {
    _id: { type: String, required: true },
    timestamp: { type: Number, required: true },
    sender: [{ type: String, required: true }],
    content: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export default model("Message", MessageSchema);
