import type { NextFunction, Request, Response } from "express";
import { config } from "../config.js";
import { deleteAllUsers } from "../db/queries/reset.js";
import { Forbidden } from "./errors.js";

export const handleReset = async (_: Request, res: Response, next: NextFunction) => {
    if (config.platform !== "dev") {
        next(new Forbidden("Reset is only allowed in the dev environment"));
        return;
    }
    try {
        config.fileServerHits = 0;
        await deleteAllUsers();
        res.write("Hits reset to 0 and all users deleted");
        res.end();
    } catch (err) {
        next(err);
    }
};
