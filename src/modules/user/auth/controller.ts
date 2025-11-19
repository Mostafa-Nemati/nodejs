import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../../../../generated/prisma";
import jwt from 'jsonwebtoken';
import { loginSchema } from "./validator";
const prisma = new PrismaClient();

//User register
export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
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
        const userInfo = {
            id: user.id,
            name: user.name,
            family: user.family
        }
        res.status(201).json({ data: userInfo, message: 'با موفقیت ثبت شد' })
    } catch (err) {
        next(err)
    }
}

//User login
export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsed = loginSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ errors: parsed });
        }
        const { phone, password } = req.body;
        const user = await prisma.user.findUnique({ where: { phone: phone } });
        if (!user) return res.status(422).json({ error: "کاربر نامعتبر میباشد" });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(422).json({ error: "پسورد معتبر نیست" });

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET || 'fallbackSecretKey',
            { expiresIn: '10d' }
        )
        const userInfo = {
            id: user.id,
            name: user.name,
            family: user.family,
        }
        res.status(200).json({ data: { user: userInfo, access_token: token }, message: "با موفقیت ثبت شد." });
    } catch (error) {
        next(error)
    }
}