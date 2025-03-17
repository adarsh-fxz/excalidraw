import { Router, Router as ExpressRouter } from 'express';
import middleware from '../middleware';
import { CreateRoomSchema } from '@repo/common/types';
import { prismaClient } from '@repo/db/client';

export const roomRouter: ExpressRouter = Router();

roomRouter.get('/', middleware, async (req, res) => {
    try {
        const rooms = await prismaClient.room.findMany();
        res.json({ rooms });
    } catch (e) {
        res.json({
            message: "Something went wrong"
        })
    }
});

roomRouter.post('/', middleware, async (req, res) => {
    const data = CreateRoomSchema.safeParse(req.body);

    if (!data.success) {
        res.json({
            message: "Invalid data"
        });
        return
    }
    try {
        const room = await prismaClient.room.create({
            data: {
                slug: data.data.slug,
                adminId: data.data.adminId,
            }
        })
        if (!room) {
            res.json({
                message: "Room already exists"
            })
            return
        }

        res.json({ message: "Room created", room });
    }
    catch (e) {
        res.json({
            message: "Something went wrong"
        })
    }
});