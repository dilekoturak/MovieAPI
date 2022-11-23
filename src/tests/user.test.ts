import UserService from "../services/user.service"
import UserController from "../controllers/user.controller"
import AuthService from "../services/auth.service";
import MovieService from "../services/movie.service";
import * as bcrypt from "bcryptjs"

describe('UserController', () => {

    const httpMocks = require('node-mocks-http')
    const email = "testt@yopmail.com"
    const password = "45896834"
    let userService
    let authService
    let movieService
    let userController
    let saveUser

    beforeEach((): void => {
        userService = new UserService()
        authService = new AuthService()
        movieService = new MovieService()
        userController = new UserController(authService, userService, movieService)

        let user: any = {
            email: email,
            password: password
        }
        saveUser = jest.spyOn(AuthService.prototype, 'save').mockImplementation(async() => Promise.resolve(user))
    })

    describe('registerUser', () => {
        it('should register user', async () => {
            const request = httpMocks.createRequest({
                method: 'GET',
                url: '/api/user/register',
                body: {
                  email: email,
                  password: password
                }
            })
            const response = httpMocks.createResponse();

            await userController.registerUser(request, response)
            const result = JSON.parse(response._getData())

            expect(saveUser).toHaveBeenCalledTimes(1)
            expect(saveUser).toHaveBeenCalledWith(email, password);
            expect(response._getStatusCode()).toBe(201)
            expect(result.message).toBe("User successfully created");
        })        
    })
})