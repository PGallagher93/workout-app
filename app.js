const express = require("express");
const { getEndpoints } = require("./controllers/api-controller");
const { getPremadeWorkouts, getWorkoutsByUserID, getWorkoutStatsByWorkoutID} = require("./controllers/workout-controllers");
const {getExercises} = require("./controllers/exercise-controllers")
const { handleCustomErrors, handleErrors } = require("./error-handlers");
const app = express();

app.use(express.json());

app.get("/api", getEndpoints);
app.get("/api/premades", getPremadeWorkouts)
app.get("/api/workouts/:user_id", getWorkoutsByUserID)
app.get("/api/user/workouts/:workout_id", getWorkoutStatsByWorkoutID)
app.get("/api/exercises", getExercises)

app.use((req, res) => {
    
    res.status(404).send({msg:"not found"})
})

app.use(handleCustomErrors)
app.use(handleErrors)

module.exports = app;
