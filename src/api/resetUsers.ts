import type { NextFunction, Request, Response } from "express";
import { config } from "../config.js";
import { deleteAllUsers } from "../db/queries/reset.js";
import { Forbidden } from "./errors.js";

export const handleDeleteAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    console.log(config);
    if (config.platform !== "dev") {
        next(new Forbidden("Reset is only allowed in the dev environment"));
        return;
    }
    try {
        await deleteAllUsers();
        res.status(200).json({ message: "All users deleted" });
    } catch (err) {
        console.error("Error deleting users:", err);
        res.status(400).json({ error: "Users could not be deleted." });
    }
};
