# MovieAPI

1) docker run --name postgres -e POSTGRES_PASSWORD=123456 -p 5432:5432 -d postgres

2) create db

3) npm install

## Run server

4) npm start

## Run tests

5) npm test

## Check Job immediately in order to save movies to DB

go to jobs/node-schedule.js

change 
"* 1 * * *" --> in every 1 hour
with 
"*/10 * * * * *" --> in every 10 sec  --> P.S.: it will take 1 page (20 movies) from the api and save to DB in every 10 sec
