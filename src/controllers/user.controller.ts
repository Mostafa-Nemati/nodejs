
import { NextFunction, Request, Response } from 'express';
import {PrismaClient} from '../../generated/prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body;
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if(existingUser) {
            return res.status(400).json({ error: 'کاربر از قبل ثبت نام شده است' })
        }
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        const user = await prisma.user.create({ 
            data: {
            ...req.body,
            verifyCode
        }});
        res.status(201).json({ data: user, verifyCode })
    } catch (err) {
        next(err)
    }
}

export const accountVerify = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id, code } = req.body;
        const user = await prisma.user.findUnique({ where: { id: Number(id) } });

        if(!user) throw new Error('User not found');
        if(user.isVerified) throw new Error('User already verified');
        if(user.verifyCode !== code) throw new Error('Invalid verification code');

        //update user
        const updateUser = await prisma.user.update({
            where: { id: Number(id) },
            data: {
                verifyCode: '',
                isVerified: true
            }
        });

        const token = jwt.sign(
            { id: updateUser.id },
            process.env.JWT_SECRET || 'fallbackSecretKey',
            { expiresIn: '7d' }
        )
        return res.json({ message: 'User verified successfully', user, token });
    } catch (error) {
       next(error)
    }
}

export const signinUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });

        if(!user) throw new Error('Invalid email');

        //const isValid = await bcrypt.compare(password, user.password);
        const isValid = password === user.password ;
        if(!isValid) throw new Error('Invalid password');

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        const updateUser = await prisma.user.update({
            where: { email },
            data: {
                verifyCode: verifyCode,
            }
        })
        return res.json({ message: 'Login successful', updateUser, verifyCode });

    } catch (error) {
        next(error)
    }
}