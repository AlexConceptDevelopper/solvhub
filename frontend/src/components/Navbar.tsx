import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav
      className="
        sticky
        top-0
        z-50
        bg-slate-950/70
        backdrop-blur-md
        border-b
        border-slate-900
        shadow-[inset_0_-1px_0_rgba(255,255,255,0.05)]
        px-6
        md:px-10
        py-3.5
        transition-all
      "
    >
      <div
        className="
          max-w-6xl
          mx-auto
          flex
          items-center
          justify-between
        "
      >
        {/* LOGO PERSONNALISÉ TECH */}
        <button
          onClick={() => navigate("/")}
          className="
            text-2xl
            font-black
            tracking-tight
            cursor-pointer
            hover:opacity-90
            transition-opacity
            group
          "
        >
          <span className="text-blue-500 group-hover:text-blue-400 transition-colors">Solv</span>
          <span className="text-white font-medium">Hub</span>
        </button>

        {/* NAVIGATION LINKS */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => navigate("/")}
            className="text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-900/60 px-3 py-2 rounded-xl transition-all cursor-pointer"
          >
            Accueil
          </button>

          <button
            onClick={() => navigate("/problems")}
            className="text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-900/60 px-3 py-2 rounded-xl transition-all cursor-pointer"
          >
            Problèmes
          </button>

          <button
            onClick={() => navigate("/ranking")}
            className="text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-900/60 px-3 py-2 rounded-xl transition-all cursor-pointer animate-none"
          >
            Classement
          </button>

          {/* Séparateur */}
          <div className="h-4 w-px bg-slate-800 mx-2 hidden sm:block"></div>

          {user ? (
            // Bouton Déconnexion si logué
            <button
              onClick={handleLogout}
              className="bg-slate-800 text-slate-200 text-sm font-bold px-4 py-2 rounded-xl hover:bg-slate-700 hover:text-white transition-all cursor-pointer ml-1"
            >
              Déconnexion ({user.username})
            </button>
          ) : (
            // Bouton Connexion si visiteur
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-600 text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-blue-500 shadow-lg shadow-blue-600/10 hover:shadow-blue-500/20 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer ml-1"
            >
              Connexion
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}