const db = require("../connection")
const format = require('pg-format'
)
const {addExerciseID, findExerciseID, hashPassword} = require("./seed-utils")

function seed ({userData, exerciseData, workoutsData, workoutStatsData, exerciseRecordsData }) {
  
    return db.query("DROP TABLE IF EXISTS workout_stats;")
    .then(()=>{
        return db.query(`DROP TABLE IF EXISTS exercise_records;`)
    })
    .then(()=>{
        return db.query(`DROP TABLE IF EXISTS workouts;`)
    })
    .then(()=>{
        return db.query(`DROP TABLE IF EXISTS exercises;`)
    })
    .then(()=>{
        return db.query(`DROP TABLE IF EXISTS users;`)
    })
    .then(()=> {
        return createUsers()
    })
    .then(()=>{
        return createWorkouts()
    })
    .then(()=>{
        return createExercises()
    })
    .then(()=>{
        return createWorkoutStats()
    })
    .then(()=>{
        return createExerciseRecords()
    }).then(()=>{
        return hashPassword(userData)
    }).then((hashedPasswords)=>{
        for(let i = 0; i< userData.length; i++){
            userData[i].password = hashedPasswords[i]
        }
        
    })
    .then(() => {
        const insertUsersQueryStr = format(
            'INSERT into users (username, password) values %L;',
            userData.map(({username, password}) => [
                username,
                password
            ])
        )
        const userPromise=db.query(insertUsersQueryStr)

        const insertExercisesQueryStr = format(
            'INSERT INTO exercises (exercise_name, body_part) VALUES %L',
            exerciseData.map(({exercise_name, body_part}) => [
                exercise_name,
                body_part
            ])
        )
        const exercisesPromise = db.query(insertExercisesQueryStr)
        return Promise.all([userPromise, exercisesPromise])
    })
    .then(() => {
        const insertWorkoutsQueryStr = format(
            'INSERT INTO workouts (workout_name, workout_user, is_premade) VALUES %L',
            workoutsData.map(({workout_name, workout_user, is_premade}) => [
                workout_name,
                workout_user,
                is_premade
            ])
        )
        return db.query(insertWorkoutsQueryStr)
    })
    .then(()=>{
        const formattedExerciseData = addExerciseID(exerciseData)
        const formattedWorkoutStatsData = findExerciseID(workoutStatsData, formattedExerciseData)
        
        const insertWorkoutStatsQueryStr = format(
            'INSERT INTO workout_stats (exercise_id, weight, sets, reps, session, workout_id) VALUES %L',
            formattedWorkoutStatsData.map(({exercise_id, weight, sets, reps, session, workout_id}) => [
                exercise_id,
                weight,
                sets,
                reps,
                session,
                workout_id
            ])
        )
        return db.query(insertWorkoutStatsQueryStr)
    })
    .then(() => {
            const formattedExerciseData = addExerciseID(exerciseData)
            const formattedExerciseRecordsData = findExerciseID(exerciseRecordsData, formattedExerciseData)

            const insertExerciseRecordsqueryStr = format(
                `INSERT INTO exercise_records (exercise_id, weight, user_id) VALUES %L`,
                formattedExerciseRecordsData.map(({exercise_id, weight, user_id})=>[
                    exercise_id,
                    weight,
                    user_id
                ])
            )
            return db.query(insertExerciseRecordsqueryStr)
    })
}
function createUsers() {
    return db.query(`CREATE TABLE users(
        user_id SERIAL PRIMARY KEY,
        username VARCHAR NOT NULL,
        password VARCHAR(255) NOT NULL
    );`)
}
function createWorkouts(){
    return db.query(`CREATE TABLE workouts(
        workout_id SERIAL PRIMARY KEY,
        workout_name VARCHAR NOT NULL,
        workout_user INT REFERENCES users(user_id),
        is_premade BOOL DEFAULT false

    );`)
}
function createExercises(){
    return db.query(`CREATE TABLE exercises (
        exercise_id SERIAL PRIMARY KEY,
        exercise_name VARCHAR NOT NULL,
        body_part VARCHAR NOT NULL
    );`)
}
function createWorkoutStats(){
    return db.query(`CREATE TABLE workout_stats (
        stat_id SERIAL PRIMARY KEY,
        exercise_id INT references exercises(exercise_id),
        weight INT DEFAULT 0 NOT NULL,
        sets INT DEFAULT 1 NOT NULL,
        reps INT DEFAULT 1 NOT NULL,
        session INT DEFAULT 1 NOT NULL,
        workout_id INT REFERENCES workouts(workout_id) NOT NULL
    );`)
}
function createExerciseRecords(){
    return db.query(`CREATE TABLE exercise_records (
        record_id SERIAL PRIMARY KEY,
        exercise_id INT references exercises(exercise_id),
        weight INT DEFAULT 0 NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        user_id INT REFERENCES users(user_id)
    );`)
}
module.exports = seed