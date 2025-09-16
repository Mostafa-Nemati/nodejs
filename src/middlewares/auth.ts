import { NextFunction, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { AuthRequest } from '../types/auth-request';



export const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];
    
    if(!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallbackSecretKey') as JwtPayload;
        req.user = {id: decoded.id};
        next()
    } catch (error) {
        res.status(401).json({ error: 'Invalid token.' });
    }
}