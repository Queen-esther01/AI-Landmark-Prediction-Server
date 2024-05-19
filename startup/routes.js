const express = require('express')
const cors = require("cors");
const error = require('../middlewares/error')
const customvision = require('../routes/CustomVision')

module.exports = function(app) {
    //MIDDLEWARES
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(cors())

    app.use('/api/v1/customvision', customvision)

    //Error Middleware
    app.use(error)
}