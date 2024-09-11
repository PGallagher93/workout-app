const {insertWorkout} = require("../models/workouts-models")
const {checkUserExists} = require("../models/user-models")
exports.postWorkout = (req, res, next) => {
  const workout = req.body

  const promises = [
    checkUserExists(workout.workout_user),
    insertWorkout(workout)
  ]
  Promise.all(promises)
    .then((resolvedPromises)=>{
        res.status(201).send({workout: resolvedPromises[1]})
    })
    .catch(next)
}