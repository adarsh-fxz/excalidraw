import { prismaClient } from "@repo/db/client";
import { Router, Router as ExpressRouter } from "express";

export const chatRouter: ExpressRouter = Router();

chatRouter.get("/:roomId", async (req, res) => {
    const roomId = Number(req.params.roomId);
    const messages = await prismaClient.chat.findMany({
        where: {
            roomId: roomId
        },
        orderBy: {
            id: "desc"
        },
        take: 50
    });

    res.json({ messages });

});