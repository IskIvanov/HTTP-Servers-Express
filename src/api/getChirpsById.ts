import type { Request, Response } from "express";
import { getChirpsById } from "../db/queries/getChirpsById.js";

export const handleGetChirpsById = async (req: Request, res: Response) => {
    const chipsId = req.params.id;
    const chirpsById = await getChirpsById(chipsId);

    if (chirpsById) {
        res.status(200).send(chirpsById);
    } else {
        res.status(405).send();
    }
};
