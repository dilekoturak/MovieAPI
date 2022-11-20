import { Movie } from './entities/Movie';
import { User } from './entities/User';
import { UserMovie } from './entities/UserMovie';
import { DataSource, DataSourceOptions } from "typeorm"
import * as dotenv from "dotenv";
import { createDatabase } from "typeorm-extension";

dotenv.config();

const options: DataSourceOptions = {
    type: "postgres",
    host: process.env.DB_HOST,
    port: 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [
        User,
        Movie,
        UserMovie
    ],
    synchronize: true,
    logging: true
};

(async () => {
    await createDatabase({
        ifNotExist: true,
        options
    });
})();

export const PostgresDataSource = new DataSource(options);