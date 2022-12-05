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
            const movie_id = req.params.movie_id
            const score = req.body.score
            const note = req.body.note

            const data = await this.movieService.getMovieByID(movie_id)
            const user = req.user

            if (data && user) {
                await this.movieService.rateMovie(user.data.id, movie_id, score, note)

                const total = data.vote_count + 1
                const calculated_avg = ( (data.vote_average * data.vote_count) + score ) / total
    
                await this.movieService.updateAverageScore(data.id, calculated_avg, total)
    
                res.status(200).json({ success: true })
            } else {
                res.status(404).json({ 
                    success: false,
                    message: "Movie does not exist" 
                })
            }
        } catch (error) {
            res.status(400).json(error)
        }
    }

    async getUserMovie(req:Request, res:Response) {
        try {
            const movie_id = req.params.movie_id
            const user = req.user

            const userMovie = user ? await this.movieService.getUserRatedMovie(user.data.id, movie_id) : null

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
            const movie_id = req.params.movie_id
            const receiver = req.body.email
            const user = req.user

            const sender = user ? user.data.email : null // sender
            const movie = await this.movieService.getMovieByID(movie_id) // movie title

            if (sender && movie) {
                sendEmail(sender.email, receiver, movie.title)

                res.status(200).json({
                    success: true,
                    message: "Movie successfully sent to email"
                })
            } else {
                res.status(404).json({
                    success: false,
                    message: "User or movie does not exist"
                })
            }            
        } catch (error) {
            res.status(400).json(error)
        }
    }
}
