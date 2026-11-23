import type { NextFunction, Request, Response } from "express";
import { BadRequest } from "./errors.js";

type Data = {
    body: string;
};
export const handleValidate = async (req: Request, res: Response, next: NextFunction) => {
    const body: Data = req.body;
    const spacialWords = ["kerfuffle", "sharbert", "fornax"];

    const maxLenght = 140;
    if (body.body.length >= maxLenght) {
        throw new BadRequest(`Chirp is too long. Max length is ${maxLenght}`);
    } else {
        const words = body.body.split(" ");
        const cleanBody = words
            .map((word) => (spacialWords.includes(word.toLowerCase()) ? "****" : word))
            .join(" ");

        res.status(200).send({ cleanedBody: cleanBody });
    }
};
