import { NextFunction, Request, Response } from "express";
import  { PrismaClient } from "../../generated/prisma/client";
import { AuthRequest } from "../types/auth-request";
const prisma = new PrismaClient();

//Creare an todo
export const createTodo = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const todo = await prisma.todo.create({ data: {...req.body, authorId: req.user.id } });
        res.status(201).json({ data: todo });
    } catch (error) {
        next(error)
    }
}

export const listTodos = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page="1", limit= "10", completed, q, sortBy= "-createdAt" } = req.query;
        const filter= {};
        const skip = (Number(page) - 1) * Number(limit);
        const sortByStr = String(sortBy);
        let orderBy: any = { createdAt: "desc" };
        if (sortByStr) {
            const field = sortByStr.startsWith("-") ? sortByStr.slice(1) : sortByStr;
            const direction = sortByStr.startsWith("-") ? "desc" : "asc";
            orderBy = { [field]: direction };
        }
        const [items, total] = await Promise.all([
            prisma.todo.findMany({
                where: filter,
                orderBy,
                skip,
                take: Number(limit),
            }),
            prisma.todo.count({ where: filter }),
        ]);
        res.json({
            data: items,
            meta: {
                total,
                page: Number(page),
                limit: Number(limit),
            },
        });
    } catch (error) {
        next(error);
    }
}

export const getTodoById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id, 10);
        const todo = await prisma.todo.findUnique({
            where: {
                id
            }
        });
        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }
        res.json({ data: todo })
    } catch (err) {
        next(err)
    }
}

export const updateTodo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id, 10)
        const todo = await prisma.todo.update({
            where: {
                id
            },
            data: {
                ...req.body
            }
        });
        if(!todo) return res.status(404).json({ message: 'Item not found' });
        res.json({ data: todo })
    } catch (err) {
        next(err)
    }
}

export const deleteTodo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id, 10);
        const todo = await prisma.todo.delete({
            where: {id}
        });
        if(!todo) return res.status(404).json({ message: 'Item not found' });
        res.status(204).send()
    } catch (err) {
        next(err)
    }
}



