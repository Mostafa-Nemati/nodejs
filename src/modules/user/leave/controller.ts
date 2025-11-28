import { NextFunction, Response } from "express";
import { AuthRequest } from "../../../types/auth-request";
import { LeaveSchema } from "./validate";
import { prisma } from "../../../config/prisma";
import { LeaveStatus } from "../../../types/leave";


export const requestLeave = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const parse = LeaveSchema.safeParse(req.body);
        if (!parse.success) {
            res.status(400).json({ errors: parse })
        }
        const leave = await prisma.leaveRquest.create({ ...req.body, status: LeaveStatus.PENDING });
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
            startDate: req.query.date as string
        }
    });

    res.status(200).json({ data: logLeaves, message: 'باموفقیت انجام شد' })
}