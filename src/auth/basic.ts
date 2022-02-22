import createHttpError from "http-errors"
import atob from 'atob'
import { UserModel } from "src/services/users/schema"
import {Request, Response,  NextFunction } from 'express'

export const basicAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  
    if (!req.headers.authorization) {
      next(
        createHttpError(
          401,
          "Please provide credentials in Authorization header!"
        )
      )
    } else {
     
      const base64Credentials = req.headers.authorization.split(" ")[1]
      const decodedCredentials = atob(base64Credentials) 
  
      const [email, password] = decodedCredentials.split(":")
  
      
      const user = await UserModel.checkCredentials(email, password)
      console.log(user)
      if (user) {
    
        req.user={email: user.email, password: user.password}
        next()
      } else {
        next(createHttpError(401, "Credentials are not ok!"))
      }
    }
  }