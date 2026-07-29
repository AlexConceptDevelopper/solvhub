const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("token");

  // On vérifie si on envoie un FormData
  const isFormData = options.body instanceof FormData;

  const headers: HeadersInit = {
    // On ajoute "Content-Type": "application/json" UNIQUEMENT si ce n'est PAS un FormData
    ...(!isFormData ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
    } catch {
      // La réponse ne contient pas de JSON
    }

    throw new Error(message);
  }

  const text = await response.text();

  if (!text) {
    return undefined as T;
  }

  return JSON.parse(text) as T;
}

export default API_URL;