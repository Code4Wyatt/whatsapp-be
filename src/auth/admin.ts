// import { Request, Response, NextFunction } from "express"
// import createHttpError from "http-errors"

// export const adminOnlyMiddleware = (req: Request, res: Response, next: NextFunction) => {
//   if (req.user.role === "Admin") {
//     next()
//   } else {
//     next(createHttpError(403, "Admin only endpoint!"))
//   }
// }