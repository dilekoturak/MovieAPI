import Container from 'typedi';
import MovieController from './controllers/movie.controller';
import AuthService from './services/auth.service';
import UserController from './controllers/user.controller';
import * as express from "express";
import { validate } from "./helpers/validation"

const movieController = Container.get(MovieController);
const userController = Container.get(UserController);
const authService = Container.get(AuthService);

const router = express.Router()

router.get('/movie/:id', (req, res) => movieController.getMovie(req, res));
router.get('/movies/:page', (req, res) => movieController.getMovies(req, res));
router.post('/user/register', validate('register'), (req, res) => userController.registerUser(req, res));
router.post('/user/login', validate('login'), (req, res) => userController.loginUser(req, res));
router.get('/user/:user_id/movie/:movie_id', authService.verifyToken, (req, res) => userController.getUserMovie(req, res));
router.post('/user/:user_id/rate/:movie_id', validate('rate'), authService.verifyToken, (req, res) => userController.rateMovie(req, res));
router.post('/user/:user_id/suggest/:movie_id', validate('suggest'), authService.verifyToken, (req, res) => userController.suggestMovie(req, res));

export default router
