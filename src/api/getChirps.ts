import { NextFunction, Request, Response } from "express";
import { getChirps } from "../db/queries/getChirps.js";
// TODO:
//  - add try catch
//  - same structure as the chirps
export const handleGetChirps = async (req: Request, res: Response, next: NextFunction) => {
    const chirps = await getChirps();
    const chipsId = req.params.id;
    res.status(200).send(chirps);
};
