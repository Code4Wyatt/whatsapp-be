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