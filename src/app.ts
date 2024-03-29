
import 'reflect-metadata';
import { PostgresDataSource } from './db'
import router  from './routes'
import * as express from 'express';
import MovieJob from './jobs/node-schedule'
import Container from 'typedi';
import MovieService from './services/movie.service';

PostgresDataSource.initialize()
    .then(() => {
        const app = express()
        app.use(express.json())
        app.use('/api', router)
        app.listen(3000, () => {
            console.log("App is listening on port 3000");
        })
        const movieService = Container.get(MovieService)
        const movieJob = new MovieJob(movieService)
        movieJob.saveMovies()
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    })