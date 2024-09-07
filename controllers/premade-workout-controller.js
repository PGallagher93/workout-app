const {readPremadeWorkouts} = require("../models/premade-workout-model")

exports.getPremadeWorkouts = (req, res, next) => {
    readPremadeWorkouts().then((data) => {
        console.log(data)
    })
}