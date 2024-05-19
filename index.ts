const express = require('express')
const msRest = require("@azure/ms-rest-js");

require("dotenv").config();

const app = express()

const env = process.env.NODE_ENV || "development"

require('./startup/routes')(app)

const port = process.env.PORT || 8080

const TrainingApi = require("@azure/cognitiveservices-customvision-training");
const trainingKey = process.env["VISION_TRAINING_KEY"];
const trainingEndpoint = process.env["VISION_TRAINING_ENDPOINT"];
const credentials = new msRest.ApiKeyCredentials({ inHeader: { "Training-key": trainingKey } });
const trainer = new TrainingApi.TrainingAPIClient(credentials, trainingEndpoint);


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})

module.exports = app
