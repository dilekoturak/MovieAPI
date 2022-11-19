
import 'reflect-metadata';
import { PostgresDataSource } from './db'
import router  from './routes'
const express = require('express')

PostgresDataSource.initialize()
    .then(() => {
        const app = express()
        app.use('/api', router)
        app.listen(3000)
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    })
