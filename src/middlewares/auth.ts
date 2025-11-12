import { NextFunction, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { AuthRequest } from '../types/auth-request';
import { PrismaClient } from "../../generated/prisma/client";
const prisma = new PrismaClient();


export const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallbackSecretKey') as JwtPayload;

        const user = await prisma.user.findUnique({ where: { id: Number(decoded.id) } });
        if (!user) return res.status(401).json({ error: 'User not found.' });

        req.user = { id: user.id, role: user.role };
        next()
    } catch (error) {
        res.status(401).json({ error: 'Invalid token.' });
    }
}