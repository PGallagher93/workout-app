const db = require("../db/connection")

exports.readExercises = () => {
    return db.query(`
                SELECT *
                FROM exercises`).then(({rows}) => {
                    return rows
                })


}