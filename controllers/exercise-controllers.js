const { readExercises } = require("../models/exercise-models")

exports.getExercises = (req, res, next)=> {
      readExercises().then((data) => {
            console.log(data, "< data", data.length, "<< length")
              return res.status(200).send({exercises: data})
      })
}