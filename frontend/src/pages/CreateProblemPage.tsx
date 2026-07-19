import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { createProblem } from "../api/problem.api";
// Supposons que tu aies un fichier api/category.api.ts avec une fonction pour lister les catégories
import { getCategories } from "../api/category.api"; 
import type { ProblemCreate, Problem } from "../types/problem";
import type { Category } from "../types/category";
import useAsync from "../hooks/useAsync";
import ErrorMessage from "../components/ErrorMessage";

export default function CreateProblemPage() {
  const navigate = useNavigate();

  // Liste des catégories chargées depuis le backend
  const [categories, setCategories] = useState<Category[]>([]);
  
  const [form, setForm] = useState<ProblemCreate>({
    title: "",
    description: "",
    idCategory: 0, // Initialisé à 0 en attendant le chargement
  });

  const { loading: submitting, error: submitError, execute: submitExecute } = useAsync<Problem>();
  const { loading: loadingCats, error: catError, execute: fetchCatsExecute } = useAsync<Category[]>();

  // Chargement des catégories au montage du composant
  useEffect(() => {
    const loadCategories = async () => {
      const data = await fetchCatsExecute(() => getCategories());
      if (data && data.length > 0) {
        setCategories(data);
        // On pré-sélectionne la première catégorie retournée par la base
        setForm(prev => ({ ...prev, idCategory: data[0].idCategory }));
      }
    };
    loadCategories();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    
    setForm({
      ...form,
      // Si c'est le champ catégorie, on convertit la string du select en nombre
      [name]: name === "idCategory" ? parseInt(value, 10) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Sécurité au cas où les catégories n'auraient pas fini de charger
    if (form.idCategory === 0) return;

    const created = await submitExecute(() => createProblem(form));

    if (created) {
      navigate(`/problem/${created.idProblem}`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white/80 backdrop-blur rounded-3xl border border-slate-200 shadow-md p-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Poser un problème
        </h1>

        {(submitError || catError) && (
          <ErrorMessage message={submitError || catError || "Une erreur est survenue"} />
        )}

        <p className="mt-2 text-slate-500">
          Décrivez votre problème pour obtenir de l'aide de la communauté.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label className="block font-semibold text-slate-700 mb-2">
              Titre
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Ex : Mon PC ne démarre plus"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-2">
              Catégorie
            </label>
            <select
              name="idCategory"
              value={form.idCategory}
              onChange={handleChange}
              disabled={loadingCats}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 bg-white disabled:opacity-50"
            >
              {loadingCats ? (
                <option>Chargement des catégories...</option>
              ) : (
                categories.map((cat) => (
                  <option key={cat.idCategory} value={cat.idCategory}>
                    {cat.name}
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={6}
              placeholder="Expliquez votre problème..."
              className="w-full rounded-xl border border-slate-300 px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            disabled={submitting || loadingCats}
            className="w-full rounded-xl bg-blue-600 py-3 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {submitting ? "Création..." : "Créer le problème"}
          </button>
        </form>
      </div>
    </div>
  );
}