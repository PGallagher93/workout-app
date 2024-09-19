const db = require("../db/connection")

exports.readExercises = () => {
    return db.query(`
                SELECT *
                FROM exercises`).then(({rows}) => {
                    return rows
                })


}

exports.checkExerciseExists = (id) => {
    
    return db
        .query(
            `SELECT * 
                FROM exercises
                WHERE exercise_id = $1`,
                [id]
        ).then(({rows})=>{
            if(!rows.length) {
                return Promise.reject({status: 404, msg: "not found"})
            }
        })

}