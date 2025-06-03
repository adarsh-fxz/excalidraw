"use client"

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const [roomId, setRoomId] = useState("");
  const router = useRouter();

  return (
    <div style={{
      display: "flex",
      width: "100vw",
      height: "100vh",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <div>
        <input style={{
          padding: "10px"
        }} value={roomId} onChange={(e) => {
          setRoomId(e.target.value);
        }} type="text" placeholder="Room id"></input>

        <button style={{
          padding: "10px"
        }} onClick={() => {
          router.push(`/room/${roomId}`);
        }}>Join room</button>
      </div>
    </div>
  );
}
