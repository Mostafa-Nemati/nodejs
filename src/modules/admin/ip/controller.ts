import { NextFunction, Response } from "express";
import { PrismaClient } from "../../../../generated/prisma";
import { AuthRequest } from "../../../types/auth-request";
const prisma = new PrismaClient();


export const createIp = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const ip = await prisma.iP.create({ data: { ...req.body, authorId: req.user.id } });
        res.status(201).json({ data: ip });
    } catch (error) {
        next(error)
    }
}