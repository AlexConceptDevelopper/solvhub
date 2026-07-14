const API_URL = "http://localhost:8080/api";

export async function apiFetch(
  endpoint: string,
  options?: RequestInit
) {
  const response = await fetch(`${API_URL}${endpoint}`, options);

  if (!response.ok) {
    let message = "Une erreur est survenue";

    try {
      const error = await response.json();
      message = error.message ?? message;
    } catch {}

    throw new Error(message);
  }

  return response.json();
}

export default API_URL;