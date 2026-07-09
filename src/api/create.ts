import { NextFunction, Request, Response } from "express";
import { createUser } from "../db/queries/users.js";

export const handleCreateUser = async (req: Request, res: Response, next: NextFunction) => {
    const email: string = req.body.email
    const newUser = await createUser({email: email})
    if(!newUser){
        res.status(400).send({error: "User could not be created."})
    } else {
        res.status(201).send({
            id: newUser.id,
            createdAt: newUser.createdAt,
            updatedAt: newUser.updatedAt,
            email: newUser.email,
        })
    }
}