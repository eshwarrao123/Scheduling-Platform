import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = "7d";
const BCRYPT_SALT_ROUNDS = 12;



export interface JWTPayload {
    userId: string;
    email: string;
    username: string;
}



/** Hash a plain-text password */
export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
}

/** Compare a plain-text password against a stored hash */
export async function verifyPassword(
    password: string,
    hash: string
): Promise<boolean> {
    return bcrypt.compare(password, hash);
}



/** Sign a JWT access token */
export function signToken(payload: JWTPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/** Verify and decode a JWT token — returns payload or null */
export function verifyToken(token: string): JWTPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET) as JWTPayload;
    } catch {
        return null;
    }
}

/** Extract the Bearer token from an Authorization header */
export function extractBearerToken(
    authHeader: string | null | undefined
): string | null {
    if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
    return authHeader.slice(7);
}
