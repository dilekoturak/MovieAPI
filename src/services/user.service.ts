import { Service } from 'typedi';
import { PostgresDataSource } from '../db'
import { User } from '../entities/User'

@Service()
export default class UserService {
    private userRepository;

    constructor() {
        this.userRepository = PostgresDataSource.getRepository(User)
    }

    async getUserByID(user_id: number) {
        const user = await this.userRepository.findOne({
            where: {
                id: user_id
            }
        })
        return user
    }

}
