import { Request, Response } from "express"
import { Service } from "typedi";
import AuthService from "../services/auth.service";
import * as jwt from "jsonwebtoken"
import * as dotenv from "dotenv"

@Service()
export default class UserController {
    constructor(private readonly authService: AuthService) {
    }

    async registerUser(req:Request, res:Response) {
        try {
            const email = req.body.email
            const password = req.body.password
            const user = await this.authService.save(email, password)

            if (user) {
                res.status(201).json({ 
                    success: true,
                    message: 'User successfully created'
                 });
            } else {
                res.status(400).json({
                    success: false,
                    message: 'User is not able to created'
                })
            }
        } catch (error) {
            res.status(400).json(error);
        }
    }

    async loginUser(req:Request, res:Response) {
        try {
            const { email, password } = req.body
            const user = await this.authService.checkUser(email)
            let passCorrect = false

            if (user) {
                passCorrect = await this.authService.compare(password, user.password)

                if (passCorrect) {
                    dotenv.config()
                    const token = jwt.sign({data: user}, process.env.JWT_SECRET, {expiresIn: 60*60});
                    const refreshToken = jwt.sign({data: user}, process.env.JWT_SECRET);
                    res.status(200).json({token, refreshToken})
                } else {
                    res.status(400).json({
                        success: false,
                        message: 'Password does not match',
                    })
                }
            } else {
                res.status(400).json({
                    success: false,
                    message: 'User does not exist',
                })
            }
        } catch (error) {
            res.status(400).json(error)
        }
    }
}
