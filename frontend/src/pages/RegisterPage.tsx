import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { apiFetch } from "../api/client";
import useAsync from "../hooks/useAsync";
import PrimaryButton from "../components/PrimaryButton";
import BackButton from "../components/BackButton";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { loading, error, execute, data } = useAsync<{
    message: string;
  } | null>();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    await execute(async () => {
      const res = await apiFetch<{ message: string }>("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      return res;
    });
  };

  const handleGoogleLogin = () => {
    window.location.href = "https://api.solvhub.fr/oauth2/authorization/google";
  };

  return (
    <>
      <Helmet>
        <title>Créer un compte | SolvHub</title>
        <meta name="description" content="Rejoignez la communauté SolvHub pour poser vos problèmes techniques et partager vos solutions." />
      </Helmet>

      <div className="relative min-h-[80vh] flex flex-col items-center justify-center px-4 overflow-hidden py-8">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {data ? (
          <div className="relative w-full max-w-md bg-white border border-slate-200 p-8 rounded-2xl shadow-sm text-center">
            <div className="w-16 h-16 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xs">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-2">Vérifiez votre boîte mail</h2>
            <p className="text-slate-600 mb-6 text-sm">{data.message}</p>

            <div className="space-y-3">
              <button
                onClick={() => navigate("/")}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-2.5 rounded-xl transition-all cursor-pointer text-sm"
              >
                Retour à l'accueil
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="w-full max-w-md mb-4 flex justify-start">
              <BackButton to="/login" label="Retour à la connexion" />
            </div>

            <div className="relative w-full max-w-md bg-white border border-slate-200 p-8 rounded-2xl shadow-sm">
              <div className="w-14 h-14 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3M11 7a3 3 0 11-6 0 3 3 0 016 0zM3 21a6 6 0 0112 0" />
                </svg>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mb-1 text-center">Créer un compte</h2>
              <p className="text-slate-500 text-sm text-center mb-6">Rejoignez la communauté SolvHub</p>

              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm text-center font-medium">
                  {error}
                </div>
              )}

              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium py-2.5 rounded-xl transition-all cursor-pointer text-sm mb-6 shadow-xs"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.13 0-5.78-2.11-6.73-4.96H1.2v3.15C3.21 21.34 7.27 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.6H1.2C.43 8.15 0 9.89 0 12s.43 3.85 1.2 5.4l4.07-3.16z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.27 0 3.21 2.66 1.2 6.6l4.07 3.15c.95-2.85 3.6-4.95 6.73-4.95z"/>
                </svg>
                Continuer avec Google
              </button>

              <div className="relative flex items-center justify-center mb-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                <span className="relative bg-white px-3 text-xs uppercase tracking-wider text-slate-400 font-semibold">ou avec un email</span>
              </div>

              <form onSubmit={handleRegister} className="space-y-4" autoComplete="on">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 ml-1">Nom d'utilisateur</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-slate-50/50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
                    required
                    autoComplete="username"
                    placeholder="votre_pseudo"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 ml-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50/50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
                    required
                    autoComplete="email"
                    placeholder="vous@exemple.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 ml-1">Mot de passe</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-50/50 border border-slate-300 rounded-xl px-4 py-2.5 pr-12 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
                      required
                      autoComplete="new-password"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      )}
                    </button>
                  </div>
                </div>

                <PrimaryButton type="submit" loading={loading} loadingLabel="Inscription en cours..." className="w-full mt-2">
                  S'inscrire
                </PrimaryButton>
              </form>

              <p className="text-center text-slate-500 text-sm mt-6">
                Déjà un compte ?{" "}
                <span onClick={() => navigate("/login")} className="text-blue-600 hover:text-blue-700 cursor-pointer font-bold underline decoration-blue-200 underline-offset-4 transition-all">
                  Connecte-toi ici
                </span>
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
}