import { initDraw } from "@/app/draw";
import { useEffect, useRef, useState } from "react";
import { IconButton } from "./IconButton";
import { Circle, Pencil, RectangleHorizontal } from "lucide-react";

type Shape = "pencil" | "rectangle" | "circle";

export function Canvas({ roomId, socket }: { roomId: string, socket: WebSocket }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [selectedTool, setSelectedTool] = useState<Shape>("circle");

    useEffect(() => {
        // @ts-ignore
        window.selectedTool = selectedTool;
    }, [selectedTool]);

    useEffect(() => {
        if (canvasRef.current) {
            initDraw(canvasRef.current, roomId, socket);
        }
    }, [canvasRef, socket]);

    return <div>
        <canvas
            ref={canvasRef}
            width={window.innerWidth}
            height={window.innerHeight}
        />
        <TopBar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
    </div>
}

function TopBar({ selectedTool, setSelectedTool }: { selectedTool: Shape, setSelectedTool: (tool: Shape) => void }) {
    return <div style={{
        position: "fixed",
        top: 10,
        left: 10,
    }}>
        <IconButton activated={selectedTool === "pencil"} icon={<Pencil />} onClick={() => { setSelectedTool("pencil") }} />
        <IconButton activated={selectedTool === "rectangle"} icon={<RectangleHorizontal />} onClick={() => { setSelectedTool("rectangle") }} />
        <IconButton activated={selectedTool === "circle"} icon={<Circle />} onClick={() => { setSelectedTool("circle") }} />
    </div>
}