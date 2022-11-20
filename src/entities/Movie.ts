import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { UserMovie } from "./UserMovie"

@Entity('movie')
export class Movie {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column({
        type: "float4"
    })
    vote_average: number

    @Column()
    vote_count: number

    @OneToMany(() => UserMovie, (userMovie) => (userMovie.movie_id))
    userMovies: Array<UserMovie>;
}
