import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api/client";
import useAsync from "../hooks/useAsync";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { loading, error, execute, data } = useAsync<{ message: string }>();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    await execute(() =>
      apiFetch("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      }),
    );
  };

  // État de succès
  if (data) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-slate-900/50 border border-slate-800 p-8 rounded-2xl backdrop-blur-sm shadow-2xl text-center">
          <div className="w-16 h-16 bg-blue-500/20 border border-blue-500/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            <svg
              className="w-8 h-8 text-blue-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">
            Vérifiez votre boîte mail
          </h2>
          <p className="text-slate-300 mb-6 text-sm">{data.message}</p>

          <div className="space-y-3">
            {/* On ne propose plus le login, on propose de retourner à l'accueil ou simplement d'attendre */}
            <button
              onClick={() => navigate("/")}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2.5 rounded-xl transition-all cursor-pointer"
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-slate-900/50 border border-slate-800 p-8 rounded-2xl backdrop-blur-sm shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Créer un compte
        </h2>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-white mb-1.5 ml-1">
              Nom d'utilisateur
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              required
              autoComplete="off"
              onFocus={(e) => e.target.removeAttribute("readOnly")}
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-white mb-1.5 ml-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              required
              autoComplete="off"
              onFocus={(e) => e.target.removeAttribute("readOnly")}
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-white mb-1.5 ml-1">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              required
              autoComplete="off"
              onFocus={(e) => e.target.removeAttribute("readOnly")}
              readOnly
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-600/20 mt-4 disabled:opacity-50"
          >
            {loading ? "Inscription en cours..." : "S'inscrire"}
          </button>
        </form>
      </div>
    </div>
  );
}
