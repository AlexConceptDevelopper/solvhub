import { useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../api/client";
import useAsync from "../hooks/useAsync";
import PrimaryButton from "../components/PrimaryButton";

export default function VerifyPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const isMounted = useRef(false);

  const { loading, error, execute, data } = useAsync<{ message: string } | null>();

  useEffect(() => {
    if (token && !isMounted.current) {
      isMounted.current = true;
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
            <p className="mb-4 font-semibold">{error}</p>
            <button
              onClick={() => navigate("/login")}
              className="text-blue-400 hover:underline font-bold cursor-pointer"
            >
              Se connecter
            </button>
          </div>
        )}

        {data && (
          <div>
            <p className="text-green-400 mb-6">{data.message}</p>
            <PrimaryButton onClick={() => navigate("/login")} className="px-6 py-2">
              Aller à la connexion
            </PrimaryButton>
          </div>
        )}
      </div>
    </div>
  );
}