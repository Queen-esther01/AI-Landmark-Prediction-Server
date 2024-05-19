import { Request, Response } from "express";

const express = require('express')
const msRest = require("@azure/ms-rest-js");

require("dotenv").config();

const app = express()

const env = process.env.NODE_ENV || "development"

require('./startup/routes')(app)

const port = process.env.PORT || 8080

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})

module.exports = app
