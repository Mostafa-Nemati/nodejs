import { NextFunction, Response } from "express";
import { AuthRequest } from "../../../types/auth-request";
import { PrismaClient } from "../../../../generated/prisma";
const prisma = new PrismaClient()

export const createShift = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const shift = await prisma.shift.create({ data: { ...req.body, authorId: req.user.id } });
        res.status(201).json({ data: shift })
    } catch (error) {
        next(error)
    }
}