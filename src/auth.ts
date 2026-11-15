import argon2 from 'argon2';
// Add hasPassword function to check if a user has a password set
export function hasPassword(password: string | undefined): Promise<string> {
    // using argon hash to check if the password is set
    const passwordHash = argon2.hash(password || '');

    if (!passwordHash) {
        return Promise.resolve('Password is not set');
    }

    return Promise.resolve(passwordHash);
}

// check if the password is hashed and compare it with the provided hash
export function checkPasswordHash(password:string, hash: string): Promise<boolean> {
    return argon2.verify(hash, password);
}