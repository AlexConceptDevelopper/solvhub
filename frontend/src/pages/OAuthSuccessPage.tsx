import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../api/client";

export default function OAuthSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    localStorage.setItem("token", token);

    const fetchUserData = async () => {
      try {
        // Adapte "/auth/me" si ton endpoint backend pour récupérer le profil connecté a un autre nom
        const userData = await apiFetch<any>("/auth/me");

        if (!userData) {
          throw new Error("Impossible de récupérer les données utilisateur.");
        }

        // Structure similaire à ton LoginResponse (idUsers, username, email, role)
        const { idUsers, username, email, role } = userData;

        // 3. Mettre à jour le contexte avec le token ET l'objet user complet
        setAuth({
          token,
          user: { idUsers, username, email, role },
        });

        // 4. Redirection vers l'accueil après un court délai visuel
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 1200);
      } catch (err) {
        console.error(err);
        localStorage.removeItem("token");
        setErrorMsg("Échec de la récupération du profil Google.");
        setTimeout(() => navigate("/login", { replace: true }), 2000);
      }
    };

    fetchUserData();
  }, [searchParams, navigate, setAuth]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="relative w-full max-w-md bg-white border border-slate-200 p-8 rounded-2xl shadow-sm text-center">
        {errorMsg ? (
          <div className="text-red-600 font-medium text-sm">{errorMsg}</div>
        ) : (
          <>
            <div className="w-16 h-16 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xs animate-bounce">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-2">Connexion réussie !</h2>
            <p className="text-slate-600 text-sm mb-4">
              Authentification Google validée. Redirection en cours...
            </p>

            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full animate-pulse w-full"></div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}