import { NextFunction, Request, Response } from "express";
import { getChirps } from "../db/queries/getChirps.js";
import { getChirpsById } from "../db/queries/getChirpsById.js";

export const handleGetChirpsById = async (req: Request, res: Response, next: NextFunction) => {
    const chipsId = req.params.id;
    const chirpsById = await getChirpsById(chipsId);

    if (chirpsById) {
        res.status(200).send(chirpsById);
    } else {
        res.status(405).send();
    }
};
