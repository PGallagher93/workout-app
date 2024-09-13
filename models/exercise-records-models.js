const db = require("../db/connection")

exports.getExerciseRecordsByUserAndExerciseID = (userID, exerciseID) => {
    return db
    .query(
       `SELECT * 
           FROM exercise_records
           WHERE exercise_id =  $1
           AND
           user_id = $2`,
           [exerciseID, userID]
    ).then(({rows})=>{
       if(!rows.length) {
           return Promise.reject({status:404, msg: "not found"})
       }
       else return rows
    })
}


