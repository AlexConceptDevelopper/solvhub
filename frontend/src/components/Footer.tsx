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
        // On trie par nom ou popularité et on garde les 12 catégories
        setCategories(data);
      }
    };
    loadCategories();
  }, []);

  // On sépare les catégories en deux colonnes de 6 pour un affichage footer nickel
  const half = Math.ceil(categories.length / 2);
  const leftCategories = categories.slice(0, half);
  const rightCategories = categories.slice(half);

  return (
    <>
      <footer className="w-full border-t border-slate-200/60 bg-slate-50/90 backdrop-blur-md py-10 text-slate-500 text-sm mt-auto">
        <div className="w-full px-4 md:px-12 grid grid-cols-1 md:grid-cols-5 gap-8 max-w-7xl mx-auto">
          
          {/* Colonne 1 : Logo + Copyright & Éditeur CubTaik (Prend 2 colonnes sur 5) */}
          <div className="md:col-span-2 flex flex-col items-start gap-4">
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

          {/* Colonnes 2 & 3 : Les 12 Catégories réparties en 2 colonnes (Maillage SEO maximal) */}
          <div className="md:col-span-2 grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
                Catégories (1/2)
              </h4>
              <div className="flex flex-col space-y-1.5">
                {leftCategories.map((cat) => (
                  <Link
                    key={cat.idCategory}
                    to={`/categories/${cat.idCategory}`}
                    className="text-xs text-slate-600 hover:text-blue-600 transition-colors truncate"
                  >
                    {cat.icon} {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
                Catégories (2/2)
              </h4>
              <div className="flex flex-col space-y-1.5">
                {rightCategories.map((cat) => (
                  <Link
                    key={cat.idCategory}
                    to={`/categories/${cat.idCategory}`}
                    className="text-xs text-slate-600 hover:text-blue-600 transition-colors truncate"
                  >
                    {cat.icon} {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Colonne 4 : Liens légaux & Réseaux */}
          <div className="flex flex-col space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1">
              Informations
            </h4>
            <a href="/cgu" className="text-xs text-slate-600 hover:text-blue-600 transition">CGU</a>
            <a href="/legal" className="text-xs text-slate-600 hover:text-blue-600 transition">Mentions légales</a>
            <a href="/privacy" className="text-xs text-slate-600 hover:text-blue-600 transition">Confidentialité</a>
            <a href="/problems" className="text-xs font-semibold text-blue-600 hover:underline pt-2">Tous les problèmes →</a>
          </div>

        </div>
      </footer>

      {/* Modale de contact */}
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </>
  );
}