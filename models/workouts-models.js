const db = require("../db/connection")

exports.readPremadeWorkouts = () => {
    let queryString = `SELECT * FROM workouts WHERE is_premade = true`
    return db.query(queryString).then(({rows}) => {
        return rows;
    })
}

exports.findWorkoutsByUserID = (id) => {
    return db  
        .query(`SELECT *
                FROM workouts
                WHERE workout_user = $1`,
                [id])
        .then(({rows}) => {
            return rows
        })
    
}

exports.findWorkoutStatsByWorkoutID = (id) => {
    return db
        .query(`SELECT workout_stats.stat_id, exercises.exercise_name, workout_stats.session,
                     workout_stats.weight, workout_stats.sets, workout_stats.reps 
                     FROM workout_Stats 
                     INNER JOIN exercises ON workout_stats.exercise_id = exercises.exercise_id 
                     WHERE workout_stats.workout_id = $1 
                     ORDER BY workout_stats.stat_id`,
                     [id])
        .then(({rows}) => {
            
            return rows
        })
}

exports.checkWorkoutExists = (id) =>{
    return db
        .query(`SELECT *
                FROM workouts
                WHERE workout_id = $1`,
                [id])
                .then(({rows}) => {
                    if(!rows.length){
                        return Promise.reject({status:404, msg: "not found"})
                    }
                })
}

exports.insertWorkout = ({workout_name, workout_user}) => {

    return db
        .query(
            `INSERT INTO workouts
             (workout_name, workout_user) 
             VALUES
             ($1, $2)
             returning *`,
                [workout_name, workout_user]
        )
        .then(({rows})=>{
            console.log(rows, "rows in model")
            return rows
        })



}