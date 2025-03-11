"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardBody, CardFooter, Image } from "@heroui/react";

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
  const [page, setPage] = useState(1);
  const limit = 24;
  const totalPages = 74; // Ajustar con los datos de la API

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get(
          `https://5rxiw2egtb.execute-api.us-east-1.amazonaws.com/dev/api/games?page=${page}&limit=${limit}`,
          {
            headers: {
              Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNzQxNjU1ODU0LCJleHAiOjE3NDE2NTk0NTR9.1mAVGMVzOC_nGgyshVfWllobc8jHJ_ZF5T6-T9AlPxE`,
              "Content-Type": "application/json",
            },
          }
        );

        setGames(response.data?.data || []);
      } catch (err) {
        console.error("Error al obtener los juegos:", err);
        setError("No se pudieron cargar los juegos. Inténtalo de nuevo.");
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [page]);

  if (loading) return <p className="text-center mt-10 text-lg">Cargando juegos...</p>;
  if (error) return <p className="text-center mt-10 text-lg text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Juegos en Oferta</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {games.length > 0 ? (
          games.map((game) => (
            <Card key={game.play_guid} className="shadow-lg hover:scale-105 transform transition-transform">
              <CardHeader>
                <Image
                  src={game.play_image_url}
                  alt={game.play_nombre}
                  width={300}
                  height={200}
                  className="w-full h-40 object-cover"
                />
              </CardHeader>
              <CardBody>
                <h2 className="font-bold text-lg">{game.play_nombre}</h2>
                <p className="text-gray-600">{game.play_platforms}</p>
                <p className="text-red-500 font-bold">-{game.play_discount}%</p>
                <p className="text-gray-500 line-through">${game.play_original_price}</p>
                <p className="text-green-500 font-bold">${game.play_current_price}</p>
              </CardBody>
            </Card>
          ))
        ) : (
          <p className="text-center col-span-full text-lg">No hay juegos disponibles.</p>
        )}
      </div>

      <div className="flex justify-center mt-6 space-x-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-300 text-black rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="px-4 py-2 bg-gray-500 text-white rounded">Página {page} de {totalPages}</span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-300 text-black rounded disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
