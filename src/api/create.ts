import type { NextFunction, Request, Response } from "express";
import { hasPassword } from "../auth.js";
import { createUser } from "../db/queries/users.js";
import type { User } from "../db/schema.js";

const ERROR_MESSAGES = {
    USER_CREATION_FAILED: "User could not be created.",
};
// extract the email type and add a password type to the request body
export interface CreateUserRequestBody {
    email: string;
    password: string;
}

export type UserResponse = Omit<User, "hashed_passwords">;

export const handleCreateUser = async (req: Request, res: Response) => {
    const email: string = req.body.email;
    const password: string = req.body.password;
    const hashed_passwords: string = await hasPassword(password);
    try {
        const newUser = await createUser({ email: email, hashed_passwords: hashed_passwords });
        console.log(newUser);
        if (!newUser) {
            res.status(400).send({ error: ERROR_MESSAGES.USER_CREATION_FAILED });
        } else {
            const userResponse: UserResponse = {
                id: newUser.id,
                createdAt: newUser.createdAt,
                updatedAt: newUser.updatedAt,
                email: newUser.email,
                isChirpyRed: newUser.isChirpyRed,
            };
            res.status(201).send(userResponse);
        }
    } catch (err) {
        console.error("Error creating user:", err);
        res.status(400).send({ error: ERROR_MESSAGES.USER_CREATION_FAILED });
    }
};
