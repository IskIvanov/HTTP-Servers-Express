import { NextFunction, Request, Response } from "express";
import { BadRequest } from "./middleware.js";
import { insertChirp } from "../db/queries/insertChirp.js";

// Request body type for creating a chirp
interface CreateChirpRequestBody {
    body: string;
    userId: string;
}

export const handleCreateChirp = async (req: Request, res: Response, next: NextFunction) => {
    const { userId, body }: CreateChirpRequestBody = req.body;
    
    // Check if the userId is a valid UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const spacialWords = ['kerfuffle', 'sharbert', 'fornax']
    const maxLenght = 140

    if (!uuidRegex.test(userId)) {
        throw new BadRequest("Invalid userId. Must be a valid UUID.");
    }

    // Validate the chirp body length and content
    if(body.length >= maxLenght){
        throw new BadRequest(`Chirp is too long. Max length is ${maxLenght}`)
    } else{
        const words = body.split(' ')
        const cleanBody = words.map(word => spacialWords.includes(word.toLowerCase()) ? '****' : word).join(' ')
        // add a try catch block to handler errors from the db
        try {
            const result = await insertChirp({ userId, body: cleanBody });
            res.status(201).send(result);
        } catch (error) {
            next(error);
        }
    }
    next()
}  