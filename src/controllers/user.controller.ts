import { Request, Response } from "express"
import { Service } from "typedi";
import AuthService from "../services/auth.service";
import * as jwt from "jsonwebtoken"
import * as dotenv from "dotenv"
import MovieService from "../services/movie.service";
import UserService from "../services/user.service";
import { sendEmail } from "../services/email.service";
import { validationResult } from "express-validator";

@Service()
export default class UserController {
    constructor(private readonly authService: AuthService,
                private readonly userService: UserService,
                private readonly movieService: MovieService) {
    }

    async registerUser(req:Request, res:Response) {
        try {
            validationResult(req).throw();
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
            validationResult(req).throw();
            const { email, password } = req.body
            const user = await this.authService.checkUser(email)
            let passCorrect = false

            if (user) {
                passCorrect = await this.authService.compare(password, user.password)

                if (passCorrect) {
                    dotenv.config()
                    const token = jwt.sign({data: user}, process.env.JWT_SECRET, { expiresIn: 60*60 });
                    res.status(200).json({token})
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

    async rateMovie(req:Request, res:Response) {
        try {
            validationResult(req).throw();
            const user_id = req.params.user_id
            const movie_id = req.params.movie_id
            const score = req.body.score
            const note = req.body.note

            await this.movieService.rateMovie(user_id, movie_id, score, note)

            const { id, vote_average, vote_count } = await this.movieService.getMovieByID(movie_id)

            const total = vote_count + 1
            const calculated_avg = ( (vote_average * vote_count) + score ) / total

            await this.movieService.updateAverageScore(id, calculated_avg, total)

            res.status(200).json({ success: true })
        } catch (error) {
            res.status(400).json(error)
        }
    }

    async getUserMovie(req:Request, res:Response) {
        try {
            const user_id = req.params.user_id
            const movie_id = req.params.movie_id
            const userMovie = await this.movieService.getUserRatedMovie(user_id, movie_id)

            if (userMovie) {
                res.status(200).json(userMovie)
            } else {
                res.status(404).json({
                    success: false,
                    message: "User doesn't rate movie yet"
                })
            }
        } catch (error) {
            res.status(400).json(error)
        }
    }

    async suggestMovie(req:Request, res:Response) {
        try {
            validationResult(req).throw();
            const user_id = req.params.user_id
            const movie_id = req.params.movie_id
            const receiver = req.body.email
            
            const { email } = await this.userService.getUserByID(user_id) // sender
            const { title } = await this.movieService.getMovieByID(movie_id) // movie title

            sendEmail(email, receiver, title)

            res.status(200).json({
                success: true,
                message: "Movie successfully sent to email"
            })
            
        } catch (error) {
            res.status(400).json(error)
        }
    }
}
