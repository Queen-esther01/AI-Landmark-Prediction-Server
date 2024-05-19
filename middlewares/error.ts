import { Request, Response } from 'express'



function error(err: any, req:Request, res:Response, next: any){
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