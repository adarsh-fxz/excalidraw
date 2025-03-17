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

    // @ts-ignore
    const userId = req.userId;
    try {
        const room = await prismaClient.room.create({
            data: {
                slug: data.data.slug,
                adminId: userId,
            }
        })

        res.json({ message: "Room created", roomId: room.id });
    }
    catch (e) {
        if ((e as any).code === 'P2002') {
            res.json({
                message: "Room already exists"
            })
            return
        }
        res.json({
            message: "Something went wrong"
        })
    }
});

roomRouter.get('/:slug', async (req, res) => {
    const slug = req.params.slug;
    const room = await prismaClient.room.findFirst({
        where: {
            slug
        }
    });

    res.json({
        room
    })
})