import MovieService from '../services/movie.service';
import { Request, Response } from "express"
import { Service } from 'typedi';

@Service()
export default class MovieController {

    constructor(private readonly movieService: MovieService) {
    }

    async getMovie(req: Request, res: Response) {
        try {
            const id: number = req.params.id
            const data = await this.movieService.getMovieByID(id)
            return res.send(data)
        } catch (error) {
            res.status(400).json(error)
        }
    }

    async getMovies(req:Request, res: Response) {
        try {
            const page: number = req.params.page
            const data = await this.movieService.getMovies(page)
            return res.send(data)
        } catch (error) {
            res.status(400).json(error)
        }
    }
}
