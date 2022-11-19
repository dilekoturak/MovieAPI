import { Service } from 'typedi';
import { PostgresDataSource } from '../db';
import { Movie } from '../entities/Movie';

@Service()
export default class MovieService {
    private movieRepository;

    constructor() {
        this.movieRepository = PostgresDataSource.getRepository(Movie)
    }

    async getMovieByID(id: number): Promise<Movie> {
        const data = await this.movieRepository.findOne({
            where: {
                id: id
            }
        })
        return data
    }
}
