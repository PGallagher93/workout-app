const express = require("express");
const { getEndpoints } = require("./controllers/api-controller");
const { getPremadeWorkouts, getWorkoutsByUserID} = require("./controllers/workout-controllers")
const app = express();

app.use(express.json());

app.get("/api", getEndpoints);
app.get("/api/premades", getPremadeWorkouts)
app.get("/api/workouts/:user_id", getWorkoutsByUserID)

app.use((req, res) => {
    res.status(404).send({msg:"Not found"})
})

module.exports = app;
