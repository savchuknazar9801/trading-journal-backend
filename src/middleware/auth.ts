import { Request, Response, NextFunction } from "express";
import { extractTokenFromHeader, verifyToken } from "../utils/jwt.js";

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Extract token from the header
        const token = extractTokenFromHeader(req);

        // Checking if token exists in header 
        if (!token) {
            throw new Error('Error extracting token from headers');
        }

        // Verify the token and get the decoded value
        const decodedIdToken = await verifyToken(token);

        // Ensuring user_id is uid and adding decoded token to req.user
        const { user_id, ...restOfToken } = decodedIdToken;

        req.user = {
            ...restOfToken, 
            uid: user_id
        };

        // Move onto next steps 
        next();
    } catch (error) {
        res.status(401).json({
            message: 'Authentication failed. Ensure token is in headers'
        });
    }
}