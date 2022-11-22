import * as schedule from "node-schedule";
import { Service } from "typedi";
import MovieService from "../services/movie.service";
import * as dotenv from "dotenv"
import { Movie } from "../entities/Movie";
const axios = require('axios');

@Service()
export default class MovieJob {
    constructor(private readonly movieService: MovieService) {
        dotenv.config()
    }

    /**
     * @description Save the movie list from api to DB in every 1 hour with pagination
     */
    saveMovies() {
        schedule.scheduleJob("* 1 * * *", async () => {
            const lastMovie: Movie = await this.movieService.getLastMovie()
            const pNum: number = lastMovie ? lastMovie.page + 1 : 1
    
            axios.get(process.env.THE_MOVIEDB_API_URL + '/discover/movie?' + 'api_key=' + process.env.THE_MOVIEDB_API_KEY + '&page=' + pNum)
                .then((res) => {
                    const data = res.data.results ? res.data.results : null
      
                    if (data) {
                        console.log(pNum + "th page is saving to db")
                        data.forEach(async movie => {
                            movie.page = pNum
    
                            await this.movieService.addMovie(movie)
                        });
                    } else {
                        console.log("List or page cannot be received")
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
        })
    }
}
