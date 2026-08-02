import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function OAuthSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      // 1. Stocker le token dans le localStorage
      localStorage.setItem("token", token);
      
      // 2. Mettre à jour le contexte global d'authentification (si ton AuthContext le gère ou recharge l'user)
      // Note : Si ton AuthContext décode le token ou charge le profil automatiquement via le token du localStorage au montage, le setAuth ou un rechargement suffit.
      
      // Petit délai de 1.5 seconde pour laisser le temps à l'utilisateur de lire le message de succès (UX propre)
      const timer = setTimeout(() => {
        navigate("/", { replace: true });
      }, 1500);

      return () => clearTimeout(timer);
    } else {
      navigate("/login", { replace: true });
    }
  }, [searchParams, navigate, setAuth]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="relative w-full max-w-md bg-white border border-slate-200 p-8 rounded-2xl shadow-sm text-center">
        <div className="w-16 h-16 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xs animate-bounce">
          <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-slate-900 mb-2">Connexion réussie !</h2>
        <p className="text-slate-600 text-sm mb-4">
          Vous êtes bien authentifié via Google. Redirection vers l'accueil...
        </p>

        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
          <div className="bg-emerald-500 h-full animate-pulse w-full"></div>
        </div>
      </div>
    </div>
  );
}