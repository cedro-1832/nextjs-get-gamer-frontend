"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Game {
  play_guid: string;
  play_nombre: string;
  play_original_price: number;
  play_current_price: number;
  play_discount: number;
  play_platforms: string;
  play_purchase_link: string;
  play_image_url: string;
}

export default function GamesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch(
          "https://5rxiw2egtb.execute-api.us-east-1.amazonaws.com/dev/api/games",
          { headers: { "Content-Type": "application/json" } }
        );
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        const data = await response.json();
        setGames(data.games);
      } catch (error: any) {
        console.error("Error al obtener juegos:", error);
        setError("No se pudieron cargar los juegos. Intenta más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  if (loading) return <p className="text-center mt-10 text-lg">Cargando juegos...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold text-center mb-8">🎮 Juegos Disponibles</h1>
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
