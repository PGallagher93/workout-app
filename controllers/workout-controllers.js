const {readPremadeWorkouts} = require("../models/premade-workout-model")

exports.getPremadeWorkouts = (req, res, next) => {
    readPremadeWorkouts().then((data) => {
        return res.status(200).send({workouts: data})
    })
}

exports.getWorkoutsByUserID = (req, res, next) => {
      const {user_id} =  req.params
      findWorkoutsByUserID(user_id).then((data) => {
        console.log(data)
      })
     
}