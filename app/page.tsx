"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Table, Pagination, Image, Card, Spin, message } from "antd";

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
        message.error("Error de autenticación.");
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
        setLoading(true);
        const response = await axios.get(
          `https://5rxiw2egtb.execute-api.us-east-1.amazonaws.com/dev/api/games?page=${currentPage}&limit=${pageSize}`,
          { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
        );
        setGames(response.data?.data || []);
      } catch (err) {
        message.error("Error al obtener los juegos.");
        setError("No se pudieron cargar los juegos.");
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [token, currentPage]);

  if (loading) return <Spin size="large" className="flex justify-center items-center mt-10" />;
  if (error) return <p className="text-center mt-10 text-lg text-red-500">{error}</p>;

  const columns = [
    {
      title: "Imagen",
      dataIndex: "play_image_url",
      key: "play_image_url",
      render: (url: string) => (
        <Image
          width={80}
          height={80}
          src={url}
          style={{ borderRadius: "8px", cursor: "pointer" }}
          preview={{ mask: "Ampliar", maskStyle: { fontSize: "14px" } }}
        />
      ),
    },
    { title: "Nombre", dataIndex: "play_nombre", key: "play_nombre" },
    { title: "Plataforma", dataIndex: "play_platforms", key: "play_platforms" },
    { title: "Precio Original", dataIndex: "play_original_price", key: "play_original_price", render: (price: number) => `$${price}` },
    { title: "Precio con Descuento", dataIndex: "play_current_price", key: "play_current_price", render: (price: number) => <span style={{ color: "green" }}>${price}</span> },
    { title: "Descuento", dataIndex: "play_discount", key: "play_discount", render: (discount: number) => `${discount}%` },
    { title: "Edición", dataIndex: "play_edition", key: "play_edition" },
    { title: "Servicio Adicional", dataIndex: "play_additional_service", key: "play_additional_service" },
    {
      title: "Enlace",
      dataIndex: "play_purchase_link",
      key: "play_purchase_link",
      render: (link: string) => (
        <a href={link} target="_blank" rel="noopener noreferrer" style={{ color: "blue", textDecoration: "underline" }}>
          Comprar
        </a>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: "1200px", margin: "auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center", fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>Juegos en Oferta</h1>

      {/* Tabla de Juegos */}
      <Card bordered={false} style={{ boxShadow: "0px 4px 10px rgba(0,0,0,0.1)", borderRadius: "8px", overflow: "hidden" }}>
        <Table
          dataSource={games}
          columns={columns}
          rowKey="play_guid"
          pagination={false}
          bordered
          size="middle"
        />
      </Card>

      {/* Paginación */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          onChange={(page) => setCurrentPage(page)}
          total={1757}
          showSizeChanger={false}
          style={{ textAlign: "center" }}
        />
      </div>
    </div>
  );
}
