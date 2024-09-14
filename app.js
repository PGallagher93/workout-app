const express = require("express");
const { getEndpoints } = require("./controllers/api-controller");
const {
  getPremadeWorkouts,
  getWorkoutsByUserID,
  getWorkoutStatsByWorkoutID,
  postWorkoutStats
} = require("./controllers/workout-controllers");
const { getExercises } = require("./controllers/exercise-controllers");
const { handleCustomErrors, handleErrors } = require("./error-handlers");
const { postWorkout, getExerciseRecords, postLogin } = require("./controllers/user-controllers");
const app = express();

app.use(express.json());

app.get("/api", getEndpoints);
app.get("/api/premades", getPremadeWorkouts);
app.get("/api/workouts/:user_id", getWorkoutsByUserID);
app.get("/api/user/workouts/:workout_id", getWorkoutStatsByWorkoutID);
app.get("/api/exercises", getExercises);
app.get("/api/user/:user_id/exercise_records/:exercise_id", getExerciseRecords)

app.post("/api/user/login", postLogin)
app.post("/api/workouts/:user_id", postWorkout);
app.post("/api/workouts/workout_stats/:workout_id", postWorkoutStats);

app.use((req, res) => {
  res.status(404).send({ msg: "not found" });
});

app.use(handleCustomErrors);
app.use(handleErrors);

module.exports = app;
