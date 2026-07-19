import { useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../api/client";
import useAsync from "../hooks/useAsync";

export default function VerifyPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  
  // Utilisation de useRef pour bloquer l'exécution multiple en dev
  const isMounted = useRef(false);

  const { loading, error, execute, data } = useAsync<{ message: string }>();

  useEffect(() => {
    if (token && !isMounted.current) {
      isMounted.current = true; // On verrouille l'appel
      execute(() => apiFetch(`/auth/verify?token=${token}`, { method: "GET" }));
    }
  }, [token, execute]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-slate-900/50 border border-slate-800 p-8 rounded-2xl backdrop-blur-sm shadow-2xl text-center">
        <h2 className="text-2xl font-bold text-white mb-4">
          Vérification du compte
        </h2>

        {loading && <p className="text-slate-300">Validation en cours...</p>}

        {error && (
          <div className="text-red-400">
            {/* Si c'est l'erreur "déjà utilisé", c'est qu'on a déjà réussi ! */}
            <p className="mb-4 font-semibold">{error}</p>
            <button
              onClick={() => navigate("/login")}
              className="text-blue-400 hover:underline font-bold"
            >
              Se connecter
            </button>
          </div>
        )}

        {data && (
          <div>
            <p className="text-green-400 mb-6">{data.message}</p>
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-xl transition-all cursor-pointer"
            >
              Aller à la connexion
            </button>
          </div>
        )}
      </div>
    </div>
  );
}