import { db } from "../index.js";
import { chirps } from "../schema.js";
import { asc } from 'drizzle-orm';
// data from the server is typled each time user queries the server for chirps.
export async function getChirps() {
    const result = await db
      .select()
      .from(chirps)
      .orderBy(asc(chirps.createdAt))
    return result;
}