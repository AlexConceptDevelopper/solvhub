import { useState, useRef, useEffect, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "./Logo";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [navSearchQuery, setNavSearchQuery] = useState("");
  
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Fermer les menus si on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate("/");
  };

  const handleNavSearch = (e: FormEvent) => {
    e.preventDefault();
    if (!navSearchQuery.trim()) return;
    navigate(`/problems?search=${encodeURIComponent(navSearchQuery)}`);
    setIsSearchOpen(false);
    setNavSearchQuery("");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-xs px-6 md:px-10 py-3.5 transition-all">
      <div className="max-w-6xl px-4 md:px-6 mx-auto flex items-center justify-between">
        {/* LOGO */}
        <button
          onClick={() => navigate("/")}
          className="cursor-pointer hover:opacity-90 transition-opacity"
        >
          <Logo />
        </button>

        {/* NAVIGATION LINKS */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => navigate("/")}
            className="text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-slate-100 px-3 py-2 rounded-xl transition-all cursor-pointer"
          >
            Accueil
          </button>

          <button
            onClick={() => navigate("/problems")}
            className="text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-slate-100 px-3 py-2 rounded-xl transition-all cursor-pointer"
          >
            Problèmes
          </button>

          <button
            onClick={() => navigate("/ranking")}
            className="text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-slate-100 px-3 py-2 rounded-xl transition-all cursor-pointer"
          >
            Classement
          </button>

          {/* BOUTON DE RECHERCHE RAPIDE DANS LA NAVBAR */}
          <div className="relative" ref={searchRef}>
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer flex items-center justify-center"
              title="Rechercher"
            >
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
            </button>

            {/* POPUP DE RECHERCHE */}
            {isSearchOpen && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-50">
                <form onSubmit={handleNavSearch} className="flex items-center gap-2">
                  <div className="relative w-full">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-xs">
                      🔍
                    </span>
                    <input
                      type="text"
                      autoFocus
                      value={navSearchQuery}
                      onChange={(e) => setNavSearchQuery(e.target.value)}
                      placeholder="Rechercher un problème..."
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 text-xs font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-3 py-2 rounded-xl font-bold text-xs hover:bg-blue-700 transition-colors shrink-0 cursor-pointer"
                  >
                    OK
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Séparateur */}
          <div className="h-4 w-px bg-slate-200 mx-1 sm:mx-2 hidden sm:block"></div>

          {/* SECTION UTILISATEUR */}
          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 bg-slate-100 border border-slate-200 text-slate-700 text-sm font-bold px-4 py-2 rounded-xl hover:bg-slate-200 hover:text-slate-900 transition-all cursor-pointer ml-1"
              >
                <span>{user.username}</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${isMenuOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50">
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"
                  >
                    Mon profil
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => {
                        navigate("/admin");
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-blue-600 font-medium hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-pointer"
                    >
                      Dashboard Admin
                    </button>
                  )}
                  <div className="h-px bg-slate-100 my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-600 text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-blue-700 shadow-sm hover:shadow transition-all duration-200 cursor-pointer ml-1"
            >
              Connexion
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}