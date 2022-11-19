import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity('movie')
export class Movie {

    @PrimaryGeneratedColumn()
    id: number

    @Column({
        unique: true,
        type: "varchar",
        length: 250
    })
    name: string

    @Column({
        type: "varchar",
        length: 250
    })
    description: string

    @Column({
        nullable: true,
        type: "float4"
    })
    average_score: number

    @Column({
        default: 0
    })
    count_score: number
}