const { readExercises } = require("../models/exercise-models")

exports.getExercises = (req, res, next)=> {
      readExercises().then((data) => {
              return res.status(200).send({exercises: data})
      })
}