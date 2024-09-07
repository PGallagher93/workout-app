const { checkUserExists } = require("../models/user-models")
const {readPremadeWorkouts, findWorkoutsByUserID} = require("../models/workouts-models")

exports.getPremadeWorkouts = (req, res, next) => {
    readPremadeWorkouts().then((data) => {
        return res.status(200).send({workouts: data})
    })
}

exports.getWorkoutsByUserID = (req, res, next) => {
      const {user_id} =  req.params
     
      const promises = [findWorkoutsByUserID(user_id),
                        checkUserExists(user_id)]

      Promise.all(promises)
        .then((resolvedPromises) => {
        
           res.status(200).send({workouts: resolvedPromises[0]})
        })
        .catch(next)
     
}