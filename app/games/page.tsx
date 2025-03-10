"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { getGames } from "@/lib/games";
import { useAuthStore } from "@/store/authStore";

interface Game {
  play_guid: string;
  play_nombre: string;
  play_original_price: number;
  play_current_price: number;
  play_discount: number;
  play_platforms: string;
  play_purchase_link: string;
  play_image_url: string;
  play_additional_service?: string;
}

export default function GamesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const { token } = useAuthStore();

  useEffect(() => {
    if (token) {
      getGames(token).then((data) => setGames(data));
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold text-center mb-8">🎮 Juegos Disponibles</h1>
      {games.length === 0 && <p className="text-center">Cargando juegos...</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {games.map((game) => (
          <div key={game.play_guid} className="bg-gray-800 p-4 rounded-lg shadow-md hover:scale-105 transition-transform">
            <Image
              src={game.play_image_url}
              alt={game.play_nombre}
              width={300}
              height={400}
              className="rounded-md w-full"
            />
            <h2 className="text-lg font-bold mt-2">{game.play_nombre}</h2>
            <p className="text-sm text-gray-400">{game.play_platforms}</p>
            <p className="text-sm text-yellow-400">{game.play_additional_service || "Estándar"}</p>
            <p className="mt-2 text-green-400 font-bold">
              ${game.play_current_price}{" "}
              <span className="line-through text-red-400">${game.play_original_price}</span> (-{game.play_discount}%)
            </p>
            <a
              href={game.play_purchase_link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block bg-blue-600 hover:bg-blue-500 text-white text-sm px-4 py-2 rounded"
            >
              Comprar
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
