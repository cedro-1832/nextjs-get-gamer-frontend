"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, Image, Table, Pagination } from "antd";

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
  const [token, setToken] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 24;

  // Obtener el token de autenticación
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const storedToken = localStorage.getItem("authToken");
        if (storedToken) {
          setToken(storedToken);
          return;
        }

        const authResponse = await axios.post(
          "https://5rxiw2egtb.execute-api.us-east-1.amazonaws.com/dev/api/auth/login",
          { username: "admin", password: "password123" },
          { headers: { "Content-Type": "application/json" } }
        );

        const newToken = authResponse.data.token;
        localStorage.setItem("authToken", newToken);
        setToken(newToken);
      } catch (err) {
        console.error("Error de autenticación:", err);
        setError("No se pudo autenticar.");
      }
    };

    fetchToken();
  }, []);

  // Obtener los juegos
  useEffect(() => {
    if (!token) return;

    const fetchGames = async () => {
      try {
        const response = await axios.get(
          `https://5rxiw2egtb.execute-api.us-east-1.amazonaws.com/dev/api/games?page=${currentPage}&limit=${pageSize}`,
          { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
        );
        setGames(response.data?.data || []);
      } catch (err) {
        console.error("Error al obtener los juegos:", err);
        setError("No se pudieron cargar los juegos.");
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [token, currentPage]);

  if (loading) return <p className="text-center mt-10 text-lg">Cargando juegos...</p>;
  if (error) return <p className="text-center mt-10 text-lg text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Juegos en Oferta</h1>

      {/* Grilla de tarjetas */}
      <div className="grid grid-cols-6 gap-6">
        {games.length > 0 ? (
          games.map((game) => (
            <Card
              key={game.play_guid}
              cover={
                <Image
                  src={game.play_image_url}
                  alt={game.play_nombre}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover"
                />
              }
              hoverable
            >
              <Card.Meta title={game.play_nombre} description={game.play_platforms} />
              <p className="text-red-500 font-bold mt-2">-{game.play_discount}%</p>
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
            </Card>
          ))
        ) : (
          <p className="text-center col-span-full text-lg">No hay juegos disponibles.</p>
        )}
      </div>

      {/* Tabla de Juegos */}
      <h2 className="text-2xl font-bold mt-10 mb-4 text-center">Listado de Juegos</h2>
      {games.length > 0 ? (
        <Table
          columns={[
            { title: "Imagen", dataIndex: "imagen", key: "imagen" },
            { title: "Nombre", dataIndex: "nombre", key: "nombre" },
            { title: "Plataforma", dataIndex: "plataforma", key: "plataforma" },
            { title: "Precio Original", dataIndex: "original_price", key: "original_price" },
            { title: "Precio con Descuento", dataIndex: "current_price", key: "current_price" },
            { title: "Enlace", dataIndex: "enlace", key: "enlace" },
          ]}
          dataSource={games.map((game) => ({
            key: game.play_guid,
            imagen: <Image src={game.play_image_url} alt={game.play_nombre} width={50} height={50} />,
            nombre: game.play_nombre,
            plataforma: game.play_platforms,
            original_price: <span className="line-through text-gray-500">${game.play_original_price}</span>,
            current_price: <span className="text-green-500">${game.play_current_price}</span>,
            enlace: (
              <a href={game.play_purchase_link} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                Comprar
              </a>
            ),
          }))}
          pagination={false}
        />
      ) : (
        <p className="text-center text-lg">No hay juegos disponibles.</p>
      )}

      {/* Paginación */}
      <div className="flex justify-center mt-6">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={1757} // Total de juegos disponibles
          onChange={(page) => setCurrentPage(page)}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
}
