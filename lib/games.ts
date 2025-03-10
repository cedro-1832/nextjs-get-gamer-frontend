import axios from "axios";

export const getGames = async () => {
  try {
    // Autenticación
    const authResponse = await axios.post(
      "https://5rxiw2egtb.execute-api.us-east-1.amazonaws.com/dev/api/auth/login",
      {
        username: "admin",
        password: "password123",
      }
    );

    const token = authResponse.data.token;

    // Llamada a la API de juegos con el token
    const response = await axios.get(
      "https://5rxiw2egtb.execute-api.us-east-1.amazonaws.com/dev/api/games",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.games;
  } catch (error) {
    console.error("Error al obtener juegos", error);
    return [];
  }
};
