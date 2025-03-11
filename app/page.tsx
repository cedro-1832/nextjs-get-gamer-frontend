"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardBody, CardFooter, Image, Navbar } from "@heroui/react";

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

        // Llamar a la API de juegos con el token
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
      <Navbar className="mb-6 bg-blue-600 text-white">
        <h1 className="text-xl font-bold px-4">🎮 Tienda de Juegos</h1>
      </Navbar>

      <h1 className="text-3xl font-bold mb-6 text-center">Juegos en Oferta</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {games.map((game) => (
          <Card
            key={game.play_guid}
            className="overflow-hidden transform transition-transform duration-300 hover:scale-110 shadow-lg"
          >
            <CardHeader>
              <Image
                src={game.play_image_url}
                alt={game.play_nombre}
                className="w-full h-48 object-cover"
              />
            </CardHeader>
            <CardBody>
              <h2 className="font-bold text-lg">{game.play_nombre}</h2>
              <p className="text-gray-600">{game.play_platforms}</p>
              <p className="text-red-500 font-bold">-{game.play_discount}%</p>
              <p className="text-gray-500 line-through">${game.play_original_price}</p>
              <p className="text-green-500 font-bold">${game.play_current_price}</p>
            </CardBody>
            <CardFooter>
              <a
                href={game.play_purchase_link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 block bg-blue-500 text-white text-center py-2 rounded"
              >
                Comprar
              </a>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
