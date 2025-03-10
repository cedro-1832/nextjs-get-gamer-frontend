export const loginUser = async (username: string, password: string) => {
  try {
    const response = await fetch(
      "https://5rxiw2egtb.execute-api.us-east-1.amazonaws.com/dev/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      }
    );

    if (!response.ok) {
      throw new Error("Error de autenticación");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error de autenticación", error);
    throw new Error("Credenciales inválidas");
  }
};
