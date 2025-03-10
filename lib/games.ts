import axios from "axios";

export const getGames = async (token: string) => {
  try {
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
