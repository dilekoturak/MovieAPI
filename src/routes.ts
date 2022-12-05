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

//Get Movie - Public
router.get('/movie/:id', (req, res) => movieController.getMovie(req, res));

//Get Movies
router.get('/movies/:page/take/:size', validate('movies'), (req, res) => movieController.getMovies(req, res));

//Create User
router.post('/user/register', validate('register'), (req, res) => userController.registerUser(req, res));

//Login User
router.post('/user/login', validate('login'), (req, res) => userController.loginUser(req, res));

//Get Movie - User
router.get('/user/movie/:movie_id', authService.verifyToken, (req, res) => userController.getUserMovie(req, res));

//Rate Movie
router.post('/user/rate/:movie_id', validate('rate'), authService.verifyToken, (req, res) => userController.rateMovie(req, res));

//Suggest Movie
router.post('/user/suggest/:movie_id', validate('suggest'), authService.verifyToken, (req, res) => userController.suggestMovie(req, res));

export default router
