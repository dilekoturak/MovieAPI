import MovieService from '../services/movie.service';
import { Request, Response } from "express"
import { Service } from 'typedi';

@Service()
export default class MovieController{

    constructor(private readonly movieService: MovieService) {
    }

    getMovie(req: Request, res: Response) {
        const id: number = Number(req.params.id)
        const data = this.movieService.getMovieByID(id)
        return res.send(data)
    }
}
