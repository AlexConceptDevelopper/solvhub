import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useAsync from "../hooks/useAsync";
import { apiFetch } from "../api/client";
import type { LoginResponse } from "../types/LoginResponse";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const { loading, error, execute } = useAsync<LoginResponse>();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = await execute(() =>
      apiFetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }),
    );

    if (data) {
      const { token, idUsers, username, email } = data;
      setAuth({ token, user: { idUsers, username, email } });
      navigate("/");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-slate-900/50 border border-slate-800 p-8 rounded-2xl backdrop-blur-sm shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Connexion
        </h2>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5 ml-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors"
                required
                autoComplete="off"
                onFocus={(e) => e.target.removeAttribute("readOnly")}
                readOnly
              />
            </div>
          </div>

          <div>
            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5 ml-1">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors"
                required
                autoComplete="off"
                onFocus={(e) => e.target.removeAttribute("readOnly")}
                readOnly
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/20 mt-4 disabled:opacity-50"
          >
            {loading ? "Connexion en cours..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
