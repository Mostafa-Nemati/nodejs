import { NextFunction, Response } from "express";
import { AuthRequest } from "../../../types/auth-request";

export const wallet = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {

        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' })
        }



    } catch (error) {

    }

}