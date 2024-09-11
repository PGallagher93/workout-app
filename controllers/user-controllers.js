const {insertWorkout} = require("../models/workouts-models")
const {checkUserExists} = require("../models/user-models")
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