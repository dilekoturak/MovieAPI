
import 'reflect-metadata';
import { PostgresDataSource } from './db'
import router  from './routes'
import * as express from 'express';
// import MovieJob from './jobs/node-schedule'
// import Container from 'typedi';
// import MovieService from './services/movie.service';

PostgresDataSource.initialize()
    .then(() => {
        const app = express()
        app.set("port", 3000)
        app.use(express.json())
        app.use('/api', router)
        app.listen(3000, () => {
            console.log("App is running");
            // const movieService = Container.get(MovieService)
            // const movieJob = new MovieJob(movieService)
            // movieJob.getMovies()
        })
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    })
