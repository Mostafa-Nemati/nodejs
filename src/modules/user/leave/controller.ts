import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../../../types/auth-request";
import { LeaveSchema } from "./validate";
import { prisma } from "../../../config/prisma";
import { LeaveStatus } from "../../../types/leave";


export const requestLeave = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return res.status(400).json({ error: 'کاربر یافت نشد' })
        }
        const parse = LeaveSchema.safeParse(req.body);
        if (!parse.success) {
            return res.status(400).json({ errors: parse.error })
        }
        const leave = await prisma.leaveRquest.create({
            data: {
                ...req.body,
                userId: req.user.id,
                status: LeaveStatus.PENDING
            }
        });
        res.status(201).json({ data: leave, message: 'باموفقیت انجام شد' })
    } catch (error) {
        next(error)
    }
}

export const logLeaves = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
        res.status(400).json({ error: 'کاربر یافت نشد' })
    }

    const leaves = await prisma.leaveRquest.findMany({
        where: {
            userId,
            startDate: {
                startsWith: req.query.date as string
            }
        }
    });

    res.status(200).json({ data: leaves, message: 'باموفقیت انجام شد' })
}