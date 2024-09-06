const express = require("express");
const { getEndpoints } = require("./controllers/api-controller");
const app = express();

app.use(express.json());

app.get("/api", getEndpoints);

module.exports = app;
