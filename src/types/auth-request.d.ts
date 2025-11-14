import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import { JwtUser } from "./jwt";

export interface AuthRequest extends Request {
    user?: JwtUser
}