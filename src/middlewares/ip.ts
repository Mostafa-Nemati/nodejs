import { NextFunction, Response } from "express";
import { AuthRequest } from "../types/auth-request";
import { prisma } from "../config/prisma";
import { getNetwork } from "../utils/network";

export const ipAddressMiddleware = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const IP = await getNetwork();

    const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        include: {
            shift: {
                include: { ips: true }
            }
        }
    });

    const validIp = user?.shift?.ips.some(i => i.ipAddress === IP);
    if (!validIp) return res.status(400).json({ error: 'آی پی معتبر نیست' });

    next()
}