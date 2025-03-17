import { Router, Router as ExpressRouter } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { JWT_SECRET } from '@repo/backend-common/config';
import { CreateUserSchema, SignInSchema } from '@repo/common/types';
import { prismaClient } from '@repo/db/client';

export const authRouter: ExpressRouter = Router();

authRouter.post('/signup', async (req, res) => {
    const data = CreateUserSchema.safeParse(req.body);
    if (!data.success) {
        res.json({
            message: "Invalid data"
        });
        return
    }

    try {
        const hashedPassword = await bcrypt.hash(data.data.password, 10);
        const user = await prismaClient.user.create({
            data: {
                email: data.data.email,
                password: hashedPassword,
                name: data.data.name,
            }
        })
        if (!user) {
            res.json({
                message: "User already exists"
            })
        }
        res.json({ message: "User created" });
    } catch (e) {
        res.json({
            message: "Something went wrong"
        })
    }
})

authRouter.post('/signin', async (req, res) => {
    const data = SignInSchema.safeParse(req.body);

    if (!data.success) {
        res.json({
            message: "Invalid data"
        });
        return
    }

    try {
        const user = await prismaClient.user.findUnique({
            where: {
                email: data.data.email,
            }
        })
        if (!user) {
            res.json({
                message: "User does not exist"
            })
            return
        }

        const passwordMatch = await bcrypt.compare(data.data.password, user.password);
        if (!passwordMatch) {
            res.json({
                message: "Invalid password"
            })
            return
        }

        const token = jwt.sign({
            userId: user.id,
            name: user.name
        }, JWT_SECRET)
        res.json({ token });
        
    } catch (e) {
        res.json({
            message: "Something went wrong"
        })
    }
})