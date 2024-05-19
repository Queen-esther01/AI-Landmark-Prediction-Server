

function error(err, req, res, next){
    res.status(500).send({
        result: 'Internal Server Error',
        data: {
            status: 500,
            message: "Something went wrong",
            data: err
        }
    })
}

module.exports = error