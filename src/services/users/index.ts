import { Router } from "express";
import UserModel from "UserModel";


Router
.route('/me')
.get(async(req: any, res: any, next: NextFunction) => {

try {
    const user = await UserModel.findOne({ username: profile})
} catch (error) {
    next(error)
}
}