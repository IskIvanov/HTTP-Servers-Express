import { asc, eq, inArray } from "drizzle-orm";
import { db } from "../index.js";
import { chirps } from "../schema.js";

// data from the server is typled each time user queries the server for chirps.
export async function getChirpsById(id: string | string[]) {
    const result = await db
        .select()
        .from(chirps)
        .where(Array.isArray(id) ? inArray(chirps.id, id) : eq(chirps.id, id))
        .orderBy(asc(chirps.createdAt));
    return Array.isArray(id) ? result : result[0];
}
