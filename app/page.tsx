"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardBody, CardFooter, Image, Navbar, Table } from "@heroui/react";

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
        const response = await axios.get(
          "https://5rxiw2egtb.execute-api.us-east-1.amazonaws.com/dev/api/games?page=1&limit=24",
          {
            headers: {
              Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNzQxNjU1ODU0LCJleHAiOjE3NDE2NTk0NTR9.1mAVGMVzOC_nGgyshVfWllobc8jHJ_ZF5T6-T9AlPxE`,
              "Content-Type": "application/json",
            },
          }
        );
        setGames(response.data?.data || []); // Asegura que `games` sea un array
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

      {/* Grilla de tarjetas */}
      <div className="grid grid-cols-6 gap-6">
        {games.slice(0, 24).map((game) => (
          <Card
            key={game.play_guid}
            className="overflow-hidden transform transition-transform duration-300 hover:scale-110 shadow-lg"
          >
            <CardHeader>
              <Image
                src={game.play_image_url}
                alt={game.play_nombre}
                width={300}
                height={200}
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

      {/* Tabla de Juegos */}
      <h2 className="text-2xl font-bold mt-10 mb-4 text-center">Listado de Juegos</h2>
      <Table>
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Plataforma</th>
            <th>Precio Original</th>
            <th>Precio con Descuento</th>
            <th>Enlace</th>
          </tr>
        </thead>
        <tbody>
          {games.slice(0, 24).map((game) => (
            <tr key={game.play_guid}>
              <td>
                <Image src={game.play_image_url} alt={game.play_nombre} width={50} height={50} />
              </td>
              <td>{game.play_nombre}</td>
              <td>{game.play_platforms}</td>
              <td className="line-through text-gray-500">${game.play_original_price}</td>
              <td className="text-green-500">${game.play_current_price}</td>
              <td>
                <a
                  href={game.play_purchase_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  Comprar
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
