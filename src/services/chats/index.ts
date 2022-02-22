import express from "express";
import createHttpError from "http-errors";
import ChatModel from "../chats/chatSchema";
import { basicAuthMiddleware } from "../../auth/basic";
import { adminOnlyMiddleware } from "../../auth/admin";
import { check, validationResult } from "express-validator";
import { JWTAuthMiddleware } from "../../auth/token";
import {
  JWTAuthenticate,
  verifyRefreshTokenAndGenerateNewTokens,
} from "../../auth/tools";

const chatRouter = express.Router();

chatRouter.get("/chats", basicAuthMiddleware, async (req, res, next) => {
  try {
    const userId = req.body._id;
    const chats = await ChatModel.find({ members: userId });
    res.send(chats);
  } catch (error) {
    next(error);
  }
});

chatRouter.post("/chats", basicAuthMiddleware, async (req, res, next) => {
  try {
    const newChatMessage = new ChatModel(req.body);
    const { _id } = await newChatMessage.save();
    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});

export default chatRouter;
