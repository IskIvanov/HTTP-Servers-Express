import { beforeAll, describe, expect, it } from "vitest";
import { Unauthorized } from "./api/errors.js";
import { checkPasswordHash, hasPassword, makeJWT, validateJWT } from "./auth.js";

describe("Password hashing", () => {
    const password1 = "correctPassword123!";
    const password2 = "anotherPassword456!";
    let hash1: string;
    let hash2: string;

    beforeAll(async () => {
        hash1 = await hasPassword(password1);
        hash2 = await hasPassword(password2);
    });

    it("should return true for the correct password", async () => {
        const result = await checkPasswordHash(password1, hash1);
        expect(result).toBe(true);
    });

    it("should return false for an incorrect password", async () => {
        const result = await checkPasswordHash("wrongPassword", hash1);
        expect(result).toBe(false);
    });

    it("should return false when the password doesn't match a different hash", async () => {
        const result = await checkPasswordHash(password1, hash2);
        expect(result).toBe(false);
    });
});

describe("JWT", () => {
    const userID = "some-unique-user-id";
    const secret = "test-secret";

    it("should make a JWT that validates and returns the user ID", () => {
        const token = makeJWT(userID, 3600, secret);
        expect(validateJWT(token, secret)).toBe(userID);
    });

    it("should reject a token signed with the wrong secret", () => {
        const token = makeJWT(userID, 3600, secret);
        expect(() => validateJWT(token, "wrong-secret")).toThrow(new Unauthorized("Invalid token"));
    });

    it("should reject an expired token", () => {
        const token = makeJWT(userID, -1, secret);
        expect(() => validateJWT(token, secret)).toThrow(new Unauthorized("Token expired"));
    });

    it("should reject a malformed token", () => {
        expect(() => validateJWT("not.a.jwt", secret)).toThrow(new Unauthorized("Invalid token"));
    });
});
