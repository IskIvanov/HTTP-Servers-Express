import { db } from "../index.js";
import { users } from "../schema.js";

export async function deleteAllUsers(){
    return await db
        .delete(users)
        .returning()
}