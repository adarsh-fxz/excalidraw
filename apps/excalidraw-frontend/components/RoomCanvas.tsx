"use client"

import { WS_URL } from "@/app/config";
import { useEffect, useState } from "react";
import { Canvas } from "./Canvas";

export function RoomCanvas({roomId}: {roomId: string}) {
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const ws = new WebSocket(`${WS_URL}?token=${token}`);

        ws.onopen = () => {
            setSocket(ws);
            ws.send(JSON.stringify({
                type: "join_room",
                roomId
            }));
        }
    }, [])

    if (!socket) {
        return <div>
            Connecting to the server...
        </div>
    }

    return (
        <div>
            <Canvas roomId={roomId} socket={socket} />

        </div>
    );
}