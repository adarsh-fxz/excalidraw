import { Router, Router as ExpressRouter } from 'express';
import middleware from '../middleware';
import { CreateRoomSchema } from '@repo/common/types';

export const roomRouter: ExpressRouter = Router();

roomRouter.post('/room', middleware, async (req, res) => {
    const data = CreateRoomSchema.safeParse(req.body);

    if (!data.success) {
        res.json({
            message: "Invalid data"
        });
        return
    }

    res.json({ message: "Room created" });
});