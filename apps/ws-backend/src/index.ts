import { WebSocketServer, WebSocket } from "ws";
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@repo/backend-common/config';
import { prismaClient } from "@repo/db/client";

const wss = new WebSocketServer({ port: 8080 });

interface User {
    userId: string;
    rooms: string[];
    ws: WebSocket; // from 'ws' library
}

const users: User[] = [];

function checkUser(token: string): string | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        if (typeof decoded == 'string') {
            return null;
        }

        if (!decoded || !decoded.userId) {
            return null;
        }
        return decoded.userId;
    } catch (e) {
        return null;
    }
}

wss.on('connection', function connection(ws, request) {
    const url = request.url;
    if (!url) {
        ws.close();
        return;
    }
    const queryParams = new URLSearchParams(url.split('?')[1]);
    const token = queryParams.get('token') || "";
    const userId = checkUser(token);

    if (userId == null) {
        ws.close();
        return;
    }

    users.push({
        userId,
        rooms: [],
        ws
    })

    ws.on('message', async function incoming(data) {
        const pasrsedData = JSON.parse(data as unknown as string);

        if (pasrsedData.type === 'join_room') {
            const user = users.find(x => x.ws === ws);
            user?.rooms.push(pasrsedData.roomId);
        }

        if (pasrsedData.type === 'leave_room') {
            const user = users.find(x => x.ws === ws);
            if (!user) {
                return;
            }
            user.rooms = user?.rooms.filter(x => x === pasrsedData.room);
        }

        if (pasrsedData.type === 'chat') {
            const roomId = pasrsedData.roomId;
            const message = pasrsedData.message;

            await prismaClient.chat.create({
                data: {
                    message,
                    roomId,
                    userId
                }
            })

            users.forEach(user => {
                if (user.rooms.includes(roomId)) {
                    user.ws.send(JSON.stringify({
                        type: 'chat',
                        message,
                        roomId
                    }));
                }
            }
            );
        }
    });

});