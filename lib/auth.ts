import axios from "axios";

export const loginUser = async (username: string, password: string) => {
  try {
    const response = await axios.post(
      "https://5rxiw2egtb.execute-api.us-east-1.amazonaws.com/dev/api/auth/login",
      { username, password }
    );
    return response.data;
  } catch (error) {
    console.error("Error de autenticación", error);
    throw new Error("Credenciales inválidas");
  }
};
