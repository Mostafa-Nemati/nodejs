import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface AuthRequest extends Request {
    user?: {
        id: number,
        role?: "ADMIN" | "USER";
    }
}