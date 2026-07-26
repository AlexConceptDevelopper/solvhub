import { useState } from "react";

export default function useAsync<T>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async (
    asyncFunction: () => Promise<T>
  ): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);

      const result = await asyncFunction();
      setData(result);
      return result;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Une erreur est survenue"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    execute
  };
}