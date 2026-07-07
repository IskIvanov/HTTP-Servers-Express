import { NextFunction, Response, Request } from "express";

function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
){
 console.log("Error occured:", err)
 res.status(500).json({
    error: "Something went wrong on our end",
 })
}

export default errorHandler;