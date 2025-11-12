import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../../../../generated/prisma";
import jwt from 'jsonwebtoken';
import { loginSchema } from "./validator";
const prisma = new PrismaClient();

export const registerAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { phone, password } = req.body;
        const existingUser = await prisma.user.findUnique({ where: { phone } });
        if (existingUser) {
            return res.status(400).json({ error: 'کاربر از قبل ثبت نام شده است' })
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { ...req.body, password: hashedPassword },
        });

        res.status(201).json({ data: user })
    } catch (err) {
        next(err)
    }
}

export const loginAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = loginSchema.parse(req.body);
        const user = await prisma.user.findUnique({ where: { phone: data.phone } });
        if (!user) return res.status(401).json({ error: "کاربر نامعتبر میباشد" });
        if (user.role !== "ADMIN") return res.status(401).json({ error: 'Forbidden. Users only.' });

        const valid = await bcrypt.compare(data.password, user.password);
        if (!valid) return res.status(401).json({ error: "پسورد معتبر نیست" });

        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET || 'fallbackSecretKey',
            { expiresIn: '10d' }
        )
        return { message: "با موفقیت ثبت شد.", user, access_token: token }
    } catch (error) {
        next(error)
    }
}   