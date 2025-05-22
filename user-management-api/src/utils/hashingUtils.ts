import bcrypt from 'bcrypt';
import config from '../config';
import jwt from 'jsonwebtoken';

export default class HashingUtils {
    /**
     * Hashes a password using bcrypt.
     * @param password - The plain text password to hash.
     * @returns A promise that resolves to the hashed password.
     */
    static async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }

    /**
     * Compares a plain text password with a hashed password.
     * @param password - The plain text password.
     * @param hash - The hashed password to compare against.
     * @returns A promise that resolves to a boolean indicating if the passwords match.
     */
    static async comparePassword(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash);
    }
}