import argon2 from "argon2";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { Unauthorized } from "./api/errors.js";

const TOKEN_ISSUER = "chirpy";

type Payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export function hasPassword(password: string | undefined): Promise<string> {
    // using argon hash to check if the password is set
    const passwordHash = argon2.hash(password || "");

    if (!passwordHash) {
        return Promise.resolve("Password is not set");
    }

    return Promise.resolve(passwordHash);
}

// check if the password is hashed and compare it with the provided hash
export function checkPasswordHash(password: string, hash: string): Promise<boolean> {
    return argon2.verify(hash, password);
}

// expiresIn is in seconds
export function makeJWT(userID: string, expiresIn: number, secret: string): string {
    const issuedAt = Math.floor(Date.now() / 1000);
    const payload: Payload = {
        iss: TOKEN_ISSUER,
        sub: userID,
        iat: issuedAt,
        exp: issuedAt + expiresIn,
    };

    return jwt.sign(payload, secret, { algorithm: "HS256" });
}

// returns the user ID stored in the token, throws Unauthorized if the token is invalid
export function validateJWT(tokenString: string, secret: string): string {
    let decoded: Payload;
    try {
        decoded = jwt.verify(tokenString, secret) as JwtPayload;
    } catch (err) {
        // TokenExpiredError extends JsonWebTokenError, so check it first
        if (err instanceof jwt.TokenExpiredError) {
            throw new Unauthorized("Token expired");
        }
        if (err instanceof jwt.JsonWebTokenError) {
            throw new Unauthorized("Invalid token");
        }
        throw err;
    }

    if (decoded.iss !== TOKEN_ISSUER) {
        throw new Unauthorized("Invalid issuer");
    }
    if (!decoded.sub) {
        throw new Unauthorized("No user ID in token");
    }

    return decoded.sub;
}
