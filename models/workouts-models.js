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
