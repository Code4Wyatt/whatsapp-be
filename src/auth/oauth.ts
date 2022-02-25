import passport from "passport"
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import UserModel from "../services/users/schema"
import { JWTAuthenticate } from "./tools"
import 'dotenv/config'

const googleStrategy = new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_OAUTH_ID!,
      clientSecret: process.env.GOOGLE_OAUTH_SECRET!,
      callbackURL: `${process.env.API_URL}/users/googleRedirect`,
    },
    async (accessToken, refreshToken, profile, passportNext) => {
      try {
        // this callback is executed when Google gives us a successfull response
        // here we are receiving some informations about the user from Google (profile, email)
        console.log("PROFILE: ", profile)
  
        // 1. Check if the user is already in our db
        const user = await UserModel.findOne({ googleId: profile.id })
  
        if (user) {
          // 2. If the user is already there --> create some tokens for him/her
          const tokens = await JWTAuthenticate(user)
          // 3. Next
          passportNext(null, { tokens }) // passportNext attaches tokens to req.user --> req.user.tokens
        } else {
          // 4. If user is not in db --> add user to db and then create some tokens for him/her
          const newUser = new UserModel({
            username: profile.username,
            emails: profile.emails,
            googleId: profile.id,
          })
  
          const savedUser = await newUser.save()
          const tokens = await JWTAuthenticate(savedUser)
          // 5. Next
          passportNext(null, { tokens })
        }
      } catch (error) {
        passportNext(error as string)
      }
    }
  )
  
  passport.serializeUser(function (data, passportNext) {
    // if you don't have this function, passport will trigerr a "failed to serialize" error
    passportNext(null, data)
  })


  export default googleStrategy