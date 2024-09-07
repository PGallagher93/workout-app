const db = require("../db/connection")

exports.readPremadeWorkouts = () => {
    let queryString = `SELECT * FROM workouts WHERE is_premade = true`
    return db.query(queryString).then(({rows}) => {
        return rows;
    })
}