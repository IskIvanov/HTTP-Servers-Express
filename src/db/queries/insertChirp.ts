import { db } from "../index.js";
import { chirps } from "../schema.js";

type Chirp = {
    userId: string;
    body: string;
}

export async function insertChirp(chirp: Chirp) {
    const [result] = await db
      .insert(chirps)
      .values(chirp)
      .returning();
    return result;
}