import express from "express";
import createHttpError from "http-errors";
import { UserModel } from "./schema";
import passport from "passport";
import { basicAuthMiddleware } from "../../auth/basic.js";
import { adminOnlyMiddleware } from "../../auth/admin.js";
import { check, validationResult } from "express-validator";
import { JWTAuthMiddleware } from "../../auth/token.js";
import { JWTAuthenticate, verifyRefreshTokenAndGenerateNewTokens } from "../../auth/tools.js";

const usersRouter = express.Router();

// usersRouter.get(
//   "/googleLogin",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// ) // This endpoint receives Google Login requests from our FE, and it is going to redirect users to Google Consent Screen

// usersRouter.get(
//   "/googleRedirect", // This endpoint URL should match EXACTLY the one configured on google.cloud dashboard
//   passport.authenticate("google"),
//   async (req, res, next) => {
//     try {
//       console.log("TOKENS: ", req.user.tokens)
//       // SEND BACK TOKENS
//       res.redirect(
//         `${process.env.FE_URL}?accessToken=${req.user.tokens.accessToken}&refreshToken=${req.user.tokens.refreshToken}`
//       )
//     } catch (error) {
//       next(error)
//     }
//   }
// )

/// JWT Register 

usersRouter.post(
  "/users/account",
  async (req, res, next) => {
    try {
      const newUser = new UserModel(req.body);
      const { _id } = await newUser.save();
  

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(422).json({
          errors: errors.array(),
        });
        }
    
      const token = await JWTAuthenticate({ id: newUser._id })
      res.status(201).send({ _id, token });
    } catch (error) {
      next(error);
    }
  }
);

usersRouter.get(
  "/",
  JWTAuthMiddleware,
  adminOnlyMiddleware,
  async (req, res, next) => {
    try {
      const users = await UserModel.find();
      res.send(users);
    } catch (error) {
      next(error);
    }
  }
);

usersRouter.get("/:userId", basicAuthMiddleware, async (req, res, next) => {
  try {
    const userId = req.params.userId;

    const user = await UserModel.findById(userId);
    if (user) {
      res.send(user);
    } else {
      next(createHttpError(404, `User with id ${userId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

// Get User Stories


usersRouter.get("/:_id/posts", basicAuthMiddleware, async (req, res, next) => {
    try {
      const userId = req.params._id;
      const posts = await UserModel.find({ user: userId.toString() })
  
      res.status(200).send(posts)
  
    } catch (error) {
      next(error)
    }
  })

usersRouter.put("/:userId", basicAuthMiddleware, async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const updatedUser = await UserModel.findByIdAndUpdate(userId, req.body, {
      new: true,
    }); // by default findByIdAndUpdate returns the document pre-update, if I want to retrieve the updated document, I should use new:true as an option
    if (updatedUser) {
      res.send(updatedUser);
    } else {
      next(createHttpError(404, `User with id ${userId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

usersRouter.delete("/:userId", basicAuthMiddleware, async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const deletedUser = await UserModel.findByIdAndDelete(userId);
    if (deletedUser) {
      res.status(204).send();
    } else {
      next(createHttpError(404, `User with id ${userId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

usersRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body; // Get credentials from req.body

    const user = await UserModel.checkCredentials(email, password); // Verify the credentials

    if (user) {
      // If credentials are fine we will generate a JWT token
      const accessToken = await JWTAuthenticate(user);
      res.status(200).send({ accessToken });
    } else {
      next(createHttpError(401, "Invalid Credentials!"));
    }
  } catch (error) {
    next(error);
  }
});

export default usersRouter;
import { Router } from "express";
import { JWTAuthMiddleware } from "../../auth/token";
import UserModel from "./schema";
import multer from 'multer'

Router
.route('/me')
.get(JWTAuthMiddleware, async(req: any, res: any, next: NextFunction) => {

try {
    const user = await UserModel.findById( req.user._id);
    if(!user){
res.status(404).send("user not found!");
    }res.send(user)
} catch (error) {
    next(error)
}
})



.put(JWTAuthMiddleware, async(req: any, res: any, next:NextFunction) => {
    try {
        const user = await UserModel.findByIdAndUpdate( req.user._id, req.body)
        if(!user){
            res.status(404).send("user not found!");
                }res.send(user)
    } catch (error) {
        next(error)
    }
})

.delete(JWTAuthMiddleware, async (req, res, next) => {
    try {
        const user = await UserModel.findByIdAndDelete(req.user._id);
        if(!user){
            res.status(404).send("user not found!");
        }res.send()
    } catch (error) {
        next(error)
    }
})


Router
.route('/users/avatar')
.post(JWTAuthMiddleware, multer.single("avatar"), async (req, res, next)=>{
    console.log(req.file.path)
    try {
        const userUpDated = await UserModel.findOneAndUpdate({user:req.user.id}, {avatar:req.file.path}, {new:true})
        if(userUpDated){
            
            res.send(userUpDated)
        }else{next('Profile not found')}
        
    } catch (error) {
        next(error)
    }
})
