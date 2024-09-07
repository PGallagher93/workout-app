const express = require("express");
const { getEndpoints } = require("./controllers/api-controller");
const { getPremadeWorkouts} = require("./controllers/premade-workout-controller")
const app = express();

app.use(express.json());

app.get("/api", getEndpoints);
app.get("/api/premades", getPremadeWorkouts)

app.use((req, res) => {
    res.status(404).send({msg:"Not found"})
})

module.exports = app;
