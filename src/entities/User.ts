import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { UserMovie } from "./UserMovie"

@Entity('user')
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        unique: true
    })
    email: string

    @Column()
    password: string

    @OneToMany(() => UserMovie, (userMovie) => (userMovie.movie_id))
    userMovies: Array<UserMovie>;
}
