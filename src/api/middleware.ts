import type { NextFunction, Request, Response } from "express";
import { config } from "../config.js";
import { HttpError } from "./errors.js";

export function middlewareLogResponse(req: Request, res: Response, next: NextFunction) {
    res.on("finish", () => {
        const statusCode = res.statusCode;

        if (statusCode >= 300) {
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${statusCode}`);
        }
    });

    next();
}

export function middlewareMetricsInc(_: Request, __: Response, next: NextFunction) {
    config.fileServerHits++;
    next();
}

function errorHandler(err: Error, _req: Request, res: Response, next: NextFunction) {
    console.log("Error occured:", err);
    if (err instanceof HttpError) {
        res.status(err.statusCode).json({ error: err.message });
        return;
    }
    res.status(500).json({
        error: "Something went wrong on our end",
    });
    next();
}

export default errorHandler;
