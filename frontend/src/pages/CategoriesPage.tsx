import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCategoriesWithCount } from "../api/category.api"; 
import type { Category } from "../types/category";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getCategoriesWithCount()
      .then((data) => {
        if (data) setCategories(data);
      })
      .catch((error) => console.error("Erreur chargement catégories :", error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-full text-white p-8 space-y-8">
      <div className="max-w-6xl mx-auto bg-slate-800 border border-slate-900/80 p-6 rounded-2xl flex justify-between items-center shadow-sm">
        <div>
          <h1 className="text-3xl font-bold">Toutes les Catégories</h1>
          <p className="text-sm mt-1">
            Explore les différents sujets et trouve des solutions adaptées.
          </p>
        </div>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-blue-500 hover:bg-slate-500 border border-slate-800 font-semibold rounded-xl shadow transition cursor-pointer text-sm"
        >
          ← Retour à l'accueil
        </button>
      </div>

      {/* Contenu (grille des catégories) */}
      <div className="max-w-6xl mx-auto">
        {loading ? (
          <p className="text-center py-12">Chargement des catégories...</p>
        ) : categories.length === 0 ? (
          <p className="text-center py-12">Aucune catégorie trouvée.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((cat) => (
              <div
                key={cat.idCategory}
                onClick={() => navigate(`/categories/${cat.idCategory}`)}
                className="bg-slate-800 border border-slate-900 p-5 rounded-2xl hover:bg-slate-900/40 hover:border-slate-800 transition flex items-center justify-between shadow-sm cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl p-2.5 bg-slate-800 border border-slate-800/60 rounded-xl">
                    {cat.icon || "🏷️"}
                  </span>
                  <div>
                    <h3 className="font-semibold text-base text-white">{cat.name}</h3>
                    <p className="text-xs mt-0.5">
                      {cat.problemCount ?? 0} problème(s) associé(s)
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}