import { NextFunction, Response } from "express"
import { AuthRequest } from "../types/auth-request"
import { Role } from "../types/jwt";

export const roleMiddleware = (requiredRole: Role) => (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.user.role !== requiredRole) {
        return res.status(403).json({ message: 'Access forbidden' });
    }
    next()
}