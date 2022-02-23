import express from "express";
import createHttpError from "http-errors";
import ChatModel from "../chats/chatSchema";
import { basicAuthMiddleware } from "../../auth/basic";
// import { adminOnlyMiddleware } from "../../auth/admin";
import { check, validationResult } from "express-validator";
import { JWTAuthMiddleware } from "../../auth/token";
import {
  JWTAuthenticate,
  verifyRefreshTokenAndGenerateNewTokens,
} from "../../auth/tools";

const chatRouter = express.Router();

chatRouter.get("/", basicAuthMiddleware, async (req, res, next) => {
  try {
    const userId = req.body._id;
    const chats = await ChatModel.find({ members: userId });
    res.send(chats);
  } catch (error) {
    next(error);
  }
});

chatRouter.post("/", basicAuthMiddleware, async (req, res, next) => {
  try {
    const userId = req.body._id;
    const oldChatMessage = await ChatModel.find({
      members: { $all: [userId] },
    });
    if (oldChatMessage) {
      
    } else {
      const newChatMessage = new ChatModel();
      const { _id } = await newChatMessage.save();
      res.status(201).send({ _id });
    }
  } catch (error) {
    next(error);
  }
});

chatRouter.get("/:chatId", basicAuthMiddleware, async (req, res, next) => {
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
