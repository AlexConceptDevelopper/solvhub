import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import ContactModal from "./ContactModal";
import { getCategoriesWithCount } from "../api/category.api";
import type { Category } from "../types/category";
import useAsync from "../hooks/useAsync";

export default function Footer() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const { execute } = useAsync<Category[]>();

  useEffect(() => {
    const loadCategories = async () => {
      const data = await execute(() => getCategoriesWithCount());
      if (data) {
        // Trie par nombre de problèmes pour garder les 6 plus importantes
        const sorted = [...data].sort(
          (a, b) => b.problemCount - a.problemCount,
        );
        setCategories(sorted.slice(0, 6));
      }
    };
    loadCategories();
  }, []);

  return (
    <>
      <footer className="w-full border-t border-slate-200/60 bg-slate-50/90 backdrop-blur-md py-10 text-slate-500 text-sm mt-auto">
        <div className="w-full px-4 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-8 max-w-7xl mx-auto">
          
          {/* Colonne 1 : Logo + Copyright compact & Éditeur CubTaik */}
          <div className="flex flex-col items-start gap-4">
            <Logo />
            <div className="space-y-1">
              <p className="text-xs text-slate-400">
                © {new Date().getFullYear()} SolvHub. Tous droits réservés.
              </p>
              <p className="text-[11px] text-slate-400">
                Une solution éditée par{" "}
                <a 
                  href="https://www.cubtaik.fr" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-slate-600 hover:text-blue-600 font-semibold underline transition-colors"
                >
                  CubTaik
                </a>
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs pt-2">
              <span>📍 Paris, France</span>
              <span className="text-slate-300">•</span>
              <button 
                onClick={() => setIsContactOpen(true)}
                className="font-medium text-blue-600 hover:underline flex items-center gap-1 cursor-pointer bg-transparent border-none p-0"
              >
                <span>✉️</span> Contact
              </button>
            </div>
          </div>

          {/* Colonne 2 : Maillage SEO - Catégories principales (1 par ligne) */}
          <div className="flex flex-col space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1">
              Pages Piliers (Catégories)
            </h4>
            {categories.length > 0 ? (
              categories.map((cat) => (
                <Link
                  key={cat.idCategory}
                  to={`/categories/${cat.idCategory}`}
                  className="text-xs text-slate-600 hover:text-blue-600 transition-colors block py-0.5"
                >
                  {cat.icon} {cat.name}
                </Link>
              ))
            ) : (
              <span className="text-xs text-slate-400">Chargement...</span>
            )}
            <Link
              to="/categories"
              className="text-xs font-semibold text-blue-600 hover:underline pt-1 block"
            >
              Voir toutes les catégories →
            </Link>
          </div>

          {/* Colonne 3 : Liens légaux & Navigation rapide */}
          <div className="flex flex-col space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1">
              Informations légales
            </h4>
            <a href="/cgu" className="text-xs text-slate-600 hover:text-blue-600 transition py-0.5">
              Conditions Générales (CGU)
            </a>
            <a href="/legal" className="text-xs text-slate-600 hover:text-blue-600 transition py-0.5">
              Mentions légales
            </a>
            <a href="/privacy" className="text-xs text-slate-600 hover:text-blue-600 transition py-0.5">
              Politique de confidentialité
            </a>
            <a href="/problems" className="text-xs text-slate-600 hover:text-blue-600 transition py-0.5 pt-2 font-semibold">
              Explorer tous les problèmes
            </a>
          </div>

          {/* Colonne 4 : Réseaux sociaux */}
          <div className="flex flex-col space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1">
              Suivre la communauté
            </h4>
            <div className="flex items-center gap-2">
              {/* Facebook */}
              <a 
                href="#" 
                onClick={(e) => e.preventDefault()}
                className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-300 cursor-default shadow-xs"
                title="Bientôt disponible"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>

              {/* Instagram */}
              <a 
                href="#" 
                onClick={(e) => e.preventDefault()}
                className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-300 cursor-default shadow-xs"
                title="Bientôt disponible"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>

              {/* LinkedIn */}
              <a 
                href="#" 
                onClick={(e) => e.preventDefault()}
                className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-300 cursor-default shadow-xs"
                title="Bientôt disponible"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </div>
          </div>

        </div>
      </footer>

      {/* Intégration de la modale de contact */}
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </>
  );
}