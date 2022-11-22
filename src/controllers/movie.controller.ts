import MovieService from '../services/movie.service';
import { Request, Response } from "express"
import { Service } from 'typedi';
import { validationResult } from 'express-validator';

@Service()
export default class MovieController {

    constructor(private readonly movieService: MovieService) {
    }

    async getMovie(req: Request, res: Response) {
        try {
            const id: number = req.params.id
            const data = await this.movieService.getMovieByID(id)
            return res.status(200).json( { movie: data } )
        } catch (error) {
            res.status(400).json(error)
        }
    }

    async getMovies(req:Request, res: Response) {
        try {
            validationResult(req).throw();
            const page: number = req.params.page
            const size: number = req.params.size
            const data = await this.movieService.getMovies(page, size)
            return res.status(200).json( { movies: data } )
        } catch (error) {
            res.status(400).json(error)
        }
    }
}
