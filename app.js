const express = require("express");
const { getEndpoints } = require("./controllers/api-controller");
const { getPremadeWorkouts} = require("./controllers/premade-workout-controller")
const app = express();

app.use(express.json());

app.get("/api", getEndpoints);
app.get("/api/premades", getPremadeWorkouts)

module.exports = app;
