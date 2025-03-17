import { z } from 'zod';

export const CreateUserSchema = z.object({
    email: z.string().min(3).max(50),
    password: z.string().min(3).max(50),
    name: z.string().min(3).max(50),
});

export const SignInSchema = z.object({
    email: z.string().min(3).max(50),
    password: z.string().min(3).max(50),
});

export const CreateRoomSchema = z.object({
    slug: z.string(),
    adminId: z.string(),
});