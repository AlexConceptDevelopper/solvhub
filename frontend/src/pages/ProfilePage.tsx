import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900/50 p-6 md:p-12 text-slate-200 rounded-2xl">
      <button
        onClick={() => navigate("/")}
        className="flex items-center mx-auto px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-all cursor-pointer"
      >
        {/* L'icône */}
        <svg
          className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        {/* Le texte */}
        <span>Retour à l'accueil</span>
      </button>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">
          Paramètres du profil
        </h1>

        <div className="grid gap-8">
          {/* Section Informations */}
          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
            <h2 className="text-lg font-semibold text-white mb-4">
              Informations personnelles
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">
                  Nom d'utilisateur
                </label>
                <input
                  type="text"
                  defaultValue={user?.username}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-white focus:border-blue-500 outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  disabled
                  defaultValue={user?.email}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-slate-500 cursor-not-allowed"
                />
              </div>
              <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2 rounded-xl transition-all cursor-pointer">
                Enregistrer les modifications
              </button>
            </div>
          </div>

          {/* Section Sécurité */}
          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
            <h2 className="text-lg font-semibold text-white mb-4">Sécurité</h2>
            <button className="text-blue-400 hover:text-blue-300 font-medium text-sm transition-colors cursor-pointer">
              Changer mon mot de passe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
