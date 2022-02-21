import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import mongoose from "mongoose";
import passport from "passport";
import usersRouter from "./services/users/index.js";
import {googleStrategy} from "./auth/oauth.js";
import {
  badRequestHandler,
  genericErrorHandler,
  notFoundHandler,
  unauthorizedHandler,
  forbiddenHandler,
} from "./errorHandlers.js";

const whiteList = [process.env.FE_LOCAL_URL, process.env.FE_REMOTE_URL];

const corsOptions = {
  origin: function (origin, next) {
    console.log(origin);
    if (!origin || whiteList.indexOf(origin) !== -1) {
      next(null, true);
    } else {
      next(new Error("Not allowed by CORS"));
    }
  },
};

const server = express();

const port = process.env.PORT || 5001;

passport.use("google", googleStrategy)

// Middlewares //

server.use(cors(corsOptions));
server.use(express.json());
server.use(passport.initialize());

// Routes //

server.use("/users", usersRouter);
// server.use("/blogs", blogsRouter);
// server.use("/authors", authorsRouter);

// Error Handlers //

server.use(badRequestHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);
server.use(forbiddenHandler);
server.use(unauthorizedHandler);

mongoose.connect(process.env.MONGO_CONNECTION);

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB!");

  server.listen(port, () => {
    console.table(listEndpoints(server));
    console.log(`Server is running on port ${port}`);
  });
});

mongoose.connection.on("error", (error) => {
  console.log(error);
});

export default server;
