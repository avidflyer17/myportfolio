
import { GameScene } from "@/components/game/game-scene";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Asteroid Field | Damien Schonbakler",
    description: "Interactive 3D Space Shooter built with React Three Fiber.",
};

export default function GamePage() {
    return (
        <main className="w-full h-screen overflow-hidden bg-black">
            <GameScene />
        </main>
    );
}
