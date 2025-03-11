"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface Game {
  play_guid: string;
  play_nombre: string;
  play_original_price: number;
  play_current_price: number;
  play_discount: number;
  play_platforms: string;
  play_edition: string;
  play_additional_service: string;
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

  // Obtener token de autenticación
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

  // Obtener juegos
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

      {/* Tabla de Juegos */}
      <h2 className="text-2xl font-bold mt-10 mb-4 text-center">Listado de Juegos</h2>
      {games.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-2 border">Imagen</th>
                <th className="p-2 border">Nombre</th>
                <th className="p-2 border">Plataforma</th>
                <th className="p-2 border">Precio Original</th>
                <th className="p-2 border">Precio con Descuento</th>
                <th className="p-2 border">Descuento</th>
                <th className="p-2 border">Edición</th>
                <th className="p-2 border">Servicio Adicional</th>
                <th className="p-2 border">Enlace</th>
              </tr>
            </thead>
            <tbody>
              {games.map((game) => (
                <tr key={game.play_guid} className="hover:bg-gray-100">
                  <td className="p-2 border text-center">
                    <div className="relative">
                      <img
                        src={game.play_image_url}
                        alt={game.play_nombre}
                        className="w-16 h-16 object-cover rounded cursor-pointer transition-transform transform hover:scale-125"
                      />
                    </div>
                  </td>
                  <td className="p-2 border">{game.play_nombre}</td>
                  <td className="p-2 border">{game.play_platforms}</td>
                  <td className="p-2 border line-through text-gray-500">${game.play_original_price}</td>
                  <td className="p-2 border text-green-500">${game.play_current_price}</td>
                  <td className="p-2 border">{game.play_discount}%</td>
                  <td className="p-2 border">{game.play_edition}</td>
                  <td className="p-2 border">{game.play_additional_service}</td>
                  <td className="p-2 border text-center">
                    <a href={game.play_purchase_link} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                      Comprar
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-lg">No hay juegos disponibles.</p>
      )}

      {/* Paginación */}
      <div className="flex justify-center mt-6 space-x-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Anterior
        </button>
        <span className="mx-4 text-lg font-semibold">Página {currentPage}</span>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
