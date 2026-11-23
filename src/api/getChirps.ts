import type { Request, Response } from "express";
import { getChirps } from "../db/queries/getChirps.js";
// TODO:
//  - add try catch
//  - same structure as the chirps
export const handleGetChirps = async (req: Request, res: Response) => {
    const chirps = await getChirps();
    res.status(200).send(chirps);
};
