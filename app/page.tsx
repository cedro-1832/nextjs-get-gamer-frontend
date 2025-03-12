"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  Image,
  Card,
  Input,
  Select,
  Button,
  Spin,
  message,
} from "antd";

const { Option } = Select;

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
  const [searchTerm, setSearchTerm] = useState("");
  const [platformFilter, setPlatformFilter] = useState<string | null>(null);
  const [editionFilter, setEditionFilter] = useState<string | null>(null);
  const [serviceFilter, setServiceFilter] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<string | null>(null);

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

  // Obtener todos los juegos sin paginación
  const fetchGames = async (searchQuery = "") => {
    if (!token) return;

    try {
      setLoading(true);
      const response = await axios.get(
        `https://5rxiw2egtb.execute-api.us-east-1.amazonaws.com/dev/api/games/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setGames(response.data?.data || []);
    } catch (err) {
      message.error("Error al obtener los juegos.");
      setError("No se pudieron cargar los juegos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, [token]);

  if (loading) return <Spin size="large" className="flex justify-center items-center mt-10" />;
  if (error) return <p className="text-center mt-10 text-lg text-red-500">{error}</p>;

  // Filtrar juegos por búsqueda y filtros
  const filteredGames = games
    .filter((game) => game.play_nombre.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((game) => (platformFilter ? game.play_platforms.includes(platformFilter) : true))
    .filter((game) => (editionFilter ? game.play_edition.includes(editionFilter) : true))
    .filter((game) => (serviceFilter ? game.play_additional_service.includes(serviceFilter) : true))
    .sort((a, b) => {
      if (sortOrder === "discount") return b.play_discount - a.play_discount;
      if (sortOrder === "price") return a.play_current_price - b.play_current_price;
      return 0;
    });

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

      {/* Búsqueda y filtros */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", gap: "10px" }}>
        <Input
          placeholder="Buscar juego..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 1 }}
        />
        <Button type="primary" onClick={() => fetchGames(searchTerm)}>Buscar</Button>
        <Select placeholder="Plataforma" onChange={(value) => setPlatformFilter(value)} allowClear>
          <Option value="PS4">PS4</Option>
          <Option value="PS5">PS5</Option>
          <Option value="PS5, PS4">PS5, PS4</Option>
          <Option value="No disponible">No disponible</Option>
        </Select>
        <Select placeholder="Edición" onChange={(value) => setEditionFilter(value)} allowClear>
          <Option value="No disponible">No disponible</Option>
          <Option value="Vehicle">Vehicle</Option>
          <Option value="Premium Edition">Premium Edition</Option>
          <Option value="Add-on">Premium Edition</Option>
          <Option value="Game Bundle">Premium Edition</Option>
          <Option value="Character">Premium Edition</Option>
          <Option value="Level">Premium Edition</Option>
          <Option value="Item">Premium Edition</Option>
          <Option value="Costume">Premium Edition</Option>
          <Option value="Season Pass">Premium Edition</Option>
        </Select>
        <Select placeholder="Servicio Adicional" onChange={(value) => setServiceFilter(value)} allowClear>
          <Option value="No disponible">No disponible</Option>
          <Option value="Save 5% more">Save 5% more</Option>
          <Option value="Save 10% more">Save 5% more</Option>
          <Option value="Save 15% more">Save 5% more</Option>
          <Option value="Save 20% more">Save 5% more</Option>
          <Option value="Save 30% more">Save 5% more</Option>
          <Option value="Premium">Save 5% more</Option>
        </Select>
        <Select placeholder="Ordenar por" onChange={(value) => setSortOrder(value)} allowClear>
          <Option value="discount">Descuento</Option>
          <Option value="price">Precio</Option>
        </Select>
      </div>

      {/* Tabla de Juegos */}
      <Card style={{ boxShadow: "0px 4px 10px rgba(0,0,0,0.1)", borderRadius: "8px", overflow: "hidden" }}>
        <Table dataSource={filteredGames} columns={columns} rowKey="play_guid" pagination={false} bordered size="middle" />
      </Card>
    </div>
  );
}
