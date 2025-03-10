"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";

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

export default function Home() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        // Obtener el token de autenticación
        const authResponse = await axios.post(
          "https://5rxiw2egtb.execute-api.us-east-1.amazonaws.com/dev/api/auth/login",
          {
            username: "admin",
            password: "password123",
          }
        );

        const token = authResponse.data.token;

        // Llamada a la API de juegos con el token obtenido
        const response = await axios.get(
          "https://5rxiw2egtb.execute-api.us-east-1.amazonaws.com/dev/api/games",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setGames(response.data.games);
      } catch (err) {
        console.error("Error al obtener los juegos:", err);
        setError("No se pudieron cargar los juegos. Inténtalo de nuevo.");
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  if (loading) return <p className="text-center mt-10 text-lg">Cargando juegos...</p>;
  if (error) return <p className="text-center mt-10 text-lg text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Juegos en Oferta</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {games.map((game) => (
          <div key={game.play_guid} className="border rounded-lg shadow-lg overflow-hidden bg-white dark:bg-gray-800">
            <Image
              src={game.play_image_url}
              alt={game.play_nombre}
              width={300}
              height={200}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h2 className="font-bold text-lg">{game.play_nombre}</h2>
              <p className="text-gray-600">{game.play_platforms}</p>
              <p className="text-red-500 font-bold">-{game.play_discount}%</p>
              <p className="text-gray-500 line-through">${game.play_original_price}</p>
              <p className="text-green-500 font-bold">${game.play_current_price}</p>
              <a
                href={game.play_purchase_link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 block bg-blue-500 text-white text-center py-2 rounded"
              >
                Comprar
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
