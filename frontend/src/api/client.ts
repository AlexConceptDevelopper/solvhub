const API_URL = "http://localhost:8080/api";

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T | null> {
  const token = localStorage.getItem("token");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let message = "Une erreur est survenue";
    try {
      const error = await response.json();
      message = error.message ?? message;
    } catch {}
    throw new Error(message);
  }

  //si le contenu est vide pour éviter le crash de .json()
  const text = await response.text();
  if (!text) {
    return null as T | null;
  }

  return JSON.parse(text);
}

export default API_URL;