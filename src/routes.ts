import Container from 'typedi';
import MovieController from './controllers/movie.controller';
import * as express from "express";

const movieController = Container.get(MovieController);
const router = express.Router()

router.get('/movie/:id', (req, res) => movieController.getMovie(req, res));

export default router
