
export function IconButton({ icon, onClick, activated }: { icon: React.ReactNode, onClick: () => void, activated?: boolean }) {
    return <button className={`pointer rounded-full border p-2 bg-black hover:bg-gray-800 mr-2 ${activated ? "text-red-500" : "text-white"}`} onClick={onClick}>{icon}</button>
}