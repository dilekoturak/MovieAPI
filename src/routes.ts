import Container from 'typedi';
import MovieController from './controllers/movie.controller';
import AuthService from './services/auth.service';
import UserController from './controllers/user.controller';
import * as express from "express";

const movieController = Container.get(MovieController);
const userController = Container.get(UserController);
const authService = Container.get(AuthService);

const router = express.Router()

router.get('/movie/:id', authService.verifyToken, (req, res, next) => movieController.getMovie(req, res));
router.get('/movies/:page', authService.verifyToken, (req, res, next) => movieController.getMovies(req, res));
router.post('/user/register', (req, res) => userController.registerUser(req, res));
router.post('/user/login', (req, res) => userController.loginUser(req, res));

export default router
