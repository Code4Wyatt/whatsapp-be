import express from "express";
import createHttpError from "http-errors";
import ChatModel from "../chats/chatSchema";
import { check, validationResult } from "express-validator";
import { JWTAuthMiddleware } from "../../auth/token";
import { Socket } from "socket.io"
import {
  JWTAuthenticate,
  verifyRefreshTokenAndGenerateNewTokens,
} from "../../auth/tools";
import { onlineUsers } from "../../socket";
const chatRouter = express.Router();

chatRouter.get("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const userId = req.user!._id;
    const chats = await ChatModel.find({ members: userId });
    const userSocket = onlineUsers.find( u => u._id === userId)!.socket

    userSocket.join(chats.map(c => c._id))
    
    res.send(chats);
  } catch (error) {
    next(error);
  }
});

chatRouter.post("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const userId = req.user!._id;
    const oldChatMessage = await ChatModel.find({
      members: { $all: [userId] },
    });
    if (oldChatMessage) {
      res.send(oldChatMessage);
    } else {
      const newChatMessage = new ChatModel(req.body);
      // const { _id } = await newChatMessage.save();
      // res.status(201).send({ _id });
    }
  } catch (error) {
    next(error);
  }
});

chatRouter.get("/:chatId", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const chatId = req.params.chatId
    const singleChat = await ChatModel.findById(chatId)
    if (singleChat) {
      res.send(singleChat)
    } else {
      next(createHttpError(404, `Chat with id ${req.params.chatId} not found.`))
    }
  } catch (error) {
    next(error)
  }
})

export default chatRouter;
