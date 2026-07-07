import type { Request, Response, NextFunction } from "express";
import { config } from "../config.js";

class HttpError extends Error {
    constructor (message: string, public statusCode: number){
        super(message)
    }
}

export class NotFoundError extends HttpError {
    constructor (message: string){
        super(message, 404)
    }
}

export class Unauthorized extends HttpError {
    constructor (message: string){
        super(message, 401)
    }
}

export class Forbidden extends HttpError {
    constructor (message: string){
        super(message, 403)
    }
}

export class BadRequest extends HttpError {
    constructor (message: string){
        super(message, 400)
    }
}

export function middlewareLogResponse(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  res.on("finish", () => {
    const statusCode = res.statusCode;

    if (statusCode >= 300) {
      console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${statusCode}`);
    }
  });

  next();
}

export function middlewareMetricsInc(
    _: Request,
    __: Response,
    next: NextFunction
){
    config.fileServerHits++;
    next()
}

function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
){
 console.log("Error occured:", err)
 if(err instanceof HttpError){
    res.status(err.statusCode).json({ error: err.message })
    return
 }
 res.status(500).json({
    error: "Something went wrong on our end",
 })
 next()
}

export default errorHandler;