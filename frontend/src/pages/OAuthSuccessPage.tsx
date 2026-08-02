import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function OAuthSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      // Stocke le token reçu du backend
      localStorage.setItem("token", token);
      
      // Redirige l'utilisateur vers son tableau de bord ou l'accueil connecté
      navigate("/");
    } else {
      // Si pas de token, retourne à la connexion
      navigate("/login");
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <p className="text-slate-600 font-medium">Connexion avec Google réussie, redirection...</p>
    </div>
  );
}