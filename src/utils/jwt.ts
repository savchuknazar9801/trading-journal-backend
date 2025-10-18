import { Request } from 'express';
import { DecodedIdToken } from 'firebase-admin/auth';
import { auth } from '../configs/firebase.js';


export const verifyToken = async (token: string) => {
    try {
        const decodedIdToken: DecodedIdToken = await auth.verifyIdToken(token);
        
        return decodedIdToken;
    } catch (error) {
        throw new Error('Failed to verify token');
    }
}

export const extractTokenFromHeader = (req: Request) => {
    /**
     * Given that token embedded with header is in this format:
     * Authorization: Bearer {token}
     * We will extract just the token and return to user
     */

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }

    return authHeader.split(' ')[1];
}