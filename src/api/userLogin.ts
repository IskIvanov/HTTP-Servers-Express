import type { Request, Response, NextFunction } from "express";
import { getUserByEmail } from "../db/queries/users.js";
import { checkPasswordHash } from "../auth.js";
import { BadRequest, Unauthorized } from "./middleware.js";
import type { UserResponse } from "./create.js";

const ERROR_MESSAGES = {
    MISSING_CREDENTIALS: "Email and password are required.",
    INVALID_CREDENTIALS: "Incorrect email or password",
};

export interface LoginRequestBody {
    email: string;
    password: string;
}

export const handleUserLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = (req.body ?? {}) as Partial<LoginRequestBody>;
        if (!email || !password) {
            throw new BadRequest(ERROR_MESSAGES.MISSING_CREDENTIALS);
        }

        const user = await getUserByEmail(email);
        // argon2 hashes are salted, so we verify against the stored hash instead of re-hashing
        const isValid = user?.hashed_passwords
            ? await checkPasswordHash(password, user.hashed_passwords).catch(() => false)
            : false;

        if (!user || !isValid) {
            throw new Unauthorized(ERROR_MESSAGES.INVALID_CREDENTIALS);
        }

        const userResponse: UserResponse = {
            id: user.id,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            email: user.email,
        };
        res.status(200).send(userResponse);
    } catch (err) {
        next(err);
    }
};
