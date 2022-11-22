import { UserMovie } from './../entities/UserMovie';
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

    async getMovies(pageNumber: number) {
        const take = 10
        const page = pageNumber || 1
        const skip = (page - 1) * take

        const data:{results: [], count: number} = await this.movieRepository.find(
            { take, skip }
        );
        console.log(data)
        return data
    }

    async getLastMovie() {
        return await this.movieRepository.createQueryBuilder('movie')
            .select()
            .orderBy('movie.page', 'DESC')
            .getOne()
    }

    async addMovie(movie: Movie) {
        await this.movieRepository.save(movie)
    }

    async rateMovie(user_id: number, movie_id: number, score: number, note: string) {
        await this.movieRepository
            .createQueryBuilder()
            .insert()
            .into(UserMovie)
            .values([
                { user_id: user_id, movie_id: movie_id, score: score, note: note }
            ])
            .execute()
    }

    async updateAverageScore(movie_id: number, vote_average: number, vote_count: number) {
        await this.movieRepository
            .createQueryBuilder()
            .update()
            .set({ vote_average: vote_average, vote_count: vote_count})
            .where("id = :id", {id: movie_id})
            .execute()
    }

    async getUserRatedMovie(user_id:number, movie_id: number) {
        const movie = await this.movieRepository
            .createQueryBuilder('movie')
            .select(['movie','user_movie'])
            .leftJoin('user_movie', 'user_movie', 'user_movie.movie_id = movie.id')
            .where('user_movie.user_id = :user_id', { user_id: user_id })
            .andWhere('user_movie.movie_id = :movie_id', { movie_id: movie_id })
            .getRawOne()
        return movie
    }
}
