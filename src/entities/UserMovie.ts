import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Movie } from "./Movie";
import { User } from "./User";

@Entity()
export class UserMovie {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    user_id: number

    @Column()
    movie_id: number

    @Column()
    score: number

    @Column()
    note: string

    @ManyToOne(() => User, (user) => (user.id))
    @JoinColumn({ name: 'user_id' })
    user: User

    @ManyToOne(() => Movie, (movie) => (movie.id))
    @JoinColumn({ name: 'movie_id' })
    movie: Movie
}
