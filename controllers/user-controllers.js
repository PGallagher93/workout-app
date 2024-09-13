const {insertWorkout} = require("../models/workouts-models")
const {checkUserExists} = require("../models/user-models")
const {checkExerciseExists} = require("../models/exercise-models")
const {getExerciseRecordsByUserAndExerciseID} = require("../models/exercise-records-models")
exports.postWorkout = (req, res, next) => {
  const workout = req.body
  const {user_id} = req.params

  const promises = [
    checkUserExists(user_id),
    insertWorkout(workout, user_id)
  ]
  Promise.all(promises)
    .then((resolvedPromises)=>{
        res.status(201).send({workout: resolvedPromises[1]})
    })
    .catch(next)
}

exports.getExerciseRecords = (req, res, next) => {
  const {user_id, exercise_id} = req.params
 
  const promises= [
    checkUserExists(user_id),
    checkExerciseExists(exercise_id),
    getExerciseRecordsByUserAndExerciseID(exercise_id, user_id),

  ]
  Promise.all(promises)
         .then((resolvedPromises)=> {
          res.status(200).send({exerciseRecords: resolvedPromises[2]})
         }).catch(next)
}