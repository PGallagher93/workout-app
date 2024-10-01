# workout-app

This application allows a user to seed a database with various workouts, exercises and users and then retrieve this data via calls to the host URL or a local port. 

## hosted version

Hosted version accessible [here](https://pg-workout-app.onrender.com/)

## cloning the repository

The repository can be cloned via [github](https://github.com/PGallagher93/workout-app)

### Dependencies

The app has various dependencies (the details of which can be found in the package.json file). To install them simply type "npm i" into the terminal.

### seeding the database

In order to seed a personal database execute the following scripts in the terminal:

1.`npm run setup-dbs`
2.`npm run seed`

## testing

In order to run the provided tests input "npm run test" from the terminal.
Note: this script sets the NODE_ENV to development by default.

## Enviromental Variables

In order for the app to work you must set up two environment files formatted as:
- .env.development
- .env.production

Inside the .env.development file you will need to write "PGDATABASE=workout_app_db (or whatever you might choose to rename the db to) and a secret for the JWT written as JWT_SECRET=[your secret]

Within the .env.production file you will need to write "DATABASE_URL=[your hosted database url] and a secret for the JWT written as JWT_SECRET=[your secret]

## Running locally

To run the app locally simply input "npm run start" into the terminal (will default to port 9090). HTTP requests will then be able to be sent to the port. The endpoints available are shown in the endpoints.json file.

## Tech stack

- Express
- PSQL
- Node

## Minimum requirements

- Node: v18.13.0
- PostgreSQL: 15.5
