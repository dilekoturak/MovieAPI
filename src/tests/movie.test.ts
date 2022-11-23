import MovieService from '../services/movie.service';
import MovieController from '../controllers/movie.controller';
import { Movie } from '../entities/Movie';

describe('MovieController', () => {
    const httpMocks = require('node-mocks-http');
    let movieService
    let movieController
    let getMovieByID
    let getMovies
    let movies: { results: Array<Movie>, count: number}
    const id: number = 2
    const page: number = 1
    const size: number = 2

    beforeEach((): void => {
        movieService = new MovieService()
        movieController = new MovieController(movieService)

        movies = {
            results: [
                {
                    id: 2,
                    title: "Lost Bullet 2",
                    vote_average: 7,
                    vote_count: 104,
                    page: 1,
                    userMovies: []
                }
            ],
            count: 1
        }

        getMovieByID = jest.spyOn(MovieService.prototype, 'getMovieByID').mockImplementation(async() => Promise.resolve(movies.results[0]))
        getMovies = jest.spyOn(MovieService.prototype, 'getMovies').mockImplementation(async() => Promise.resolve(movies))

    });

    describe('getMovie', () => {
        it('should return movie', async () => {
            const request  = httpMocks.createRequest({
                method: 'GET',
                url: '/api/movie/:id',
                params: {
                  id: id
                }
            })
            const response = httpMocks.createResponse();

            await movieController.getMovie(request, response)
            const result = JSON.parse(response._getData())

            expect(getMovieByID).toHaveBeenCalledTimes(1)
            expect(getMovieByID).toHaveBeenCalledWith(id)
            expect(response._getStatusCode()).toBe(200)
            expect(result.movie).toMatchObject(movies.results[0]);
        })        
    })

    describe('getMovies', () => {
        it('should return movies', async () => {
            const request  = httpMocks.createRequest({
                method: 'GET',
                url: '/movies/:page/take/:size',
                params: {
                  page: page,
                  size: size
                }
            })
            const response = httpMocks.createResponse();

            await movieController.getMovies(request, response)
            const result = JSON.parse(response._getData())

            expect(getMovies).toHaveBeenCalledTimes(1)
            expect(getMovies).toHaveBeenCalledWith(page, size)
            expect(response._getStatusCode()).toBe(200)
            expect(result.movies).toMatchObject(movies);
        })        
    })
});

