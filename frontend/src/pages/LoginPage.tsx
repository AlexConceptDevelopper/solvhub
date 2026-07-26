import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useAsync from "../hooks/useAsync";
import { apiFetch } from "../api/client";
import type { LoginResponse } from "../types/LoginResponse";
import PrimaryButton from "../components/PrimaryButton";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const { loading, error, execute } = useAsync<LoginResponse | null>();

  const handleLogin = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = await execute(() =>
      apiFetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }),
    );

    if (data) {
      const { token, idUsers, username, email, role } = data;
      setAuth({
        token,
        user: { idUsers, username, email, role },
      });

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

        <form onSubmit={handleLogin} className="space-y-4" autoComplete="on">
          <div>
            <div>
              <label className="block text-sm font-bold text-white mb-1.5 ml-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors"
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <div>
              <label className="block text-sm font-bold text-white mb-1.5 ml-1">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors"
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          <PrimaryButton
            type="submit"
            loading={loading}
            loadingLabel="Connexion en cours..."
            className="w-full mt-4"
          >
            Se connecter
          </PrimaryButton>
        </form>
        <p className="text-center text-slate-200 text-sm mt-6">
          Pas encore de compte ?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-blue-400 hover:text-blue-300 cursor-pointer font-bold underline decoration-blue-500/50 underline-offset-4 transition-all"
          >
            Inscris-toi ici
          </span>
        </p>
      </div>
    </div>
  );
}