const express = require("express");
const { getEndpoints } = require("./controllers/api-controller");
const { getPremadeWorkouts, getWorkoutsByUserID} = require("./controllers/workout-controllers");
const { handleCustomErrors, handleErrors } = require("./error-handlers");
const app = express();

app.use(express.json());

app.get("/api", getEndpoints);
app.get("/api/premades", getPremadeWorkouts)
app.get("/api/workouts/:user_id", getWorkoutsByUserID)

app.use((req, res) => {
    console.log("THERES AN ERROR")
    res.status(404).send({msg:"not found"})
})

app.use(handleCustomErrors)
app.use(handleErrors)

module.exports = app;
