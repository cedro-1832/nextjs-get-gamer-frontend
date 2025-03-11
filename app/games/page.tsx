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

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between">
        <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}>
          Anterior
        </button>
        <span>Página {page} de {totalPages}</span>
        <button onClick={() => setPage((p) => Math.min(p + 1, totalPages))} disabled={page === totalPages}>
          Siguiente
        </button>
      </div>
    </div>
  );
}
