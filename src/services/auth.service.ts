import { Service } from 'typedi';
import { PostgresDataSource } from '../db';
import { User } from '../entities/User';
import * as jwt from "jsonwebtoken"
import * as bcrypt from "bcryptjs"
import * as dotenv from "dotenv"

@Service()
export default class AuthService {
    private userRepository;

    constructor() {
        this.userRepository = PostgresDataSource.getRepository(User)
        dotenv.config()
    }

    async save(email:string, password: string): Promise<User> {
        const hashedPassword = await bcrypt.hashSync(password, 10);
        const user = {
            email: email,
            password: hashedPassword
        }
        return this.userRepository.save(user)
    }

    checkUser(email: string) {
        return this.userRepository.findOne({
            where: {
                email: email
            }
        })
    }

    compare(password: string, realPassword: string) {
        return bcrypt.compare(password, realPassword);
    }

    verifyToken(req, res, next) {
        const auth = req.headers["authorization"]
        if (auth) {
            const token = auth.split(" ")[1]
            jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
                if (user) {
                    req.user = user
                    next()
                } else {
                    res.status(404).json({
                        success: false,
                        message: 'Invalid token'
                    })
                }
            })
        } else {
            res.status(404).json({
                success: false,
                message: 'Unauthorized access'
            })
        }
    }
}
