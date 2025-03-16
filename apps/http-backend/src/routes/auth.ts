import { Router, Router as ExpressRouter } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { JWT_SECRET } from '@repo/backend-common/config';
import { CreateUserSchema, SignInSchema } from '@repo/common/types';

export const authRouter: ExpressRouter = Router();

authRouter.post('/signup', async (req, res) => {
    const data = CreateUserSchema.safeParse(req.body);
    if (!data.success) {
        res.json({
            message: "Invalid data"
        });
        return
    }

    res.json({ message: "User created" });
})

authRouter.post('/signin', async (req, res) => {
    const data = SignInSchema.safeParse(req.body);

    if (!data.success) {
        res.json({
            message: "Invalid data"
        });
        return
    }

    res.json({ message: "User signed in" });
})