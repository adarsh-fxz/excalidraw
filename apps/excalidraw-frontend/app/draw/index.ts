import axios from "axios";
import { BACKEND_URL } from "../config";

type Shape = {
    type: "rect";
    x: number;
    y: number;
    width: number;
    height: number;
} | {
    type: "circle",
    centerX: number;
    centerY: number;
    radius: number;
} | {
    type: "path",
    points: { x: number; y: number }[];
}

export async function initDraw(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
    const ctx = canvas.getContext("2d");

    let existingShapes: Shape[] = await getExistingShapes(roomId);

    if (!ctx) return;
    ctx.strokeStyle = "white";

    // Join the room when initializing
    socket.send(JSON.stringify({
        type: "join_room",
        roomId: parseInt(roomId)
    }));

    socket.onmessage = (event) => {
        const message = JSON.parse(event.data);

        if (message.type = "chat") {
            const parsedShape = JSON.parse(message.message);
            existingShapes.push(parsedShape.shape);
            clearCanvas(existingShapes, canvas, ctx);
        }
    }

    clearCanvas(existingShapes, canvas, ctx);

    let clicked = false;
    let startX = 0;
    let startY = 0;
    let currentPath: { x: number; y: number }[] = [];

    canvas.addEventListener("mousedown", (e) => {
        clicked = true;
        startX = e.clientX;
        startY = e.clientY;
        // @ts-ignore
        const selectedTool = window.selectedTool;
        
        if (selectedTool === "pencil") {
            currentPath = [{ x: startX, y: startY }];
        }
    })

    canvas.addEventListener("mouseup", (e) => {
        // @ts-ignore
        const selectedTool = window.selectedTool;
        
        if (selectedTool === "pencil") {
            const shape: Shape = {
                type: "path",
                points: currentPath
            };
            existingShapes.push(shape);
            
            socket.send(JSON.stringify({
                type: "chat",
                message: JSON.stringify({
                    shape
                }),
                roomId: parseInt(roomId)
            }));
        } else {
            const width = e.clientX - startX;
            const height = e.clientY - startY;
            
            let shape: Shape;
            if (selectedTool === "circle") {
                const centerX = startX + width / 2;
                const centerY = startY + height / 2;
                const radius = Math.sqrt(width * width + height * height) / 2;
                shape = {
                    type: "circle",
                    centerX,
                    centerY,
                    radius
                };
            } else {
                shape = {
                    type: "rect",
                    x: startX,
                    y: startY,
                    height,
                    width
                };
            }
            existingShapes.push(shape);

            socket.send(JSON.stringify({
                type: "chat",
                message: JSON.stringify({
                    shape
                }),
                roomId: parseInt(roomId)
            }));
        }
        clicked = false;
        currentPath = [];
    })

    canvas.addEventListener("mousemove", (e) => {
        if (clicked) {
            // @ts-ignore
            const selectedTool = window.selectedTool;
            
            if (selectedTool === "pencil") {
                currentPath.push({ x: e.clientX, y: e.clientY });
                clearCanvas(existingShapes, canvas, ctx);
                // Draw the current path
                ctx.beginPath();
                ctx.moveTo(currentPath[0].x, currentPath[0].y);
                for (let i = 1; i < currentPath.length; i++) {
                    ctx.lineTo(currentPath[i].x, currentPath[i].y);
                }
                ctx.stroke();
            } else {
                const width = e.clientX - startX;
                const height = e.clientY - startY;
                clearCanvas(existingShapes, canvas, ctx)
                ctx.strokeStyle = "rgba(255, 255, 255)"

                if (selectedTool === "rectangle") {
                    ctx.strokeRect(startX, startY, width, height)
                } else if (selectedTool === "circle") {
                    const centerX = startX + width / 2;
                    const centerY = startY + height / 2;
                    const radius = Math.sqrt(width * width + height * height) / 2;
                    ctx.beginPath();
                    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
                    ctx.stroke();
                }
            }
        }
    })
}

function clearCanvas(existingShapes: Shape[], canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    existingShapes.map((shape) => {
        if (shape.type === "rect") {
            ctx.strokeRect(shape.x, shape.y, shape.width, shape.height)
        } else if (shape.type === "circle") {
            ctx.beginPath();
            ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, 2 * Math.PI);
            ctx.stroke();
        } else if (shape.type === "path") {
            ctx.beginPath();
            ctx.moveTo(shape.points[0].x, shape.points[0].y);
            for (let i = 1; i < shape.points.length; i++) {
                ctx.lineTo(shape.points[i].x, shape.points[i].y);
            }
            ctx.stroke();
        }
    })
}

async function getExistingShapes(roomId: string) {
    const res = await axios.get(`${BACKEND_URL}/api/chat/${roomId}`)
    const messages = res.data.messages;

    const shapes = messages.map((x: { message: string }) => {
        const messageData = JSON.parse(x.message)
        return messageData.shape;
    })

    return shapes;
}