import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { createProblem } from "../api/problem.api";
import { getCategories } from "../api/category.api"; 
import { getBrandsByCategory, getModelsByCategoryAndBrand, findEquipmentByCriteria } from "../api/equipment.api"; 

import type { ProblemCreate, Problem } from "../types/problem";
import type { Category } from "../types/category";
import useAsync from "../hooks/useAsync";
import ErrorMessage from "../components/ErrorMessage";

export default function CreateProblemPage() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");

  const [form, setForm] = useState<ProblemCreate>({
    title: "",
    description: "",
    idCategory: 0,
    idEquipment: undefined, // ➕ Ajouté dans le state initial
  });

  const { loading: submitting, error: submitError, execute: submitExecute } = useAsync<Problem>();
  const { loading: loadingCats, error: catError, execute: fetchCatsExecute } = useAsync<Category[]>();

  useEffect(() => {
    const loadCategories = async () => {
      const data = await fetchCatsExecute(() => getCategories());
      if (data && data.length > 0) {
        setCategories(data);
        setForm(prev => ({ ...prev, idCategory: data[0].idCategory }));
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const fetchBrands = async () => {
      if (form.idCategory === 3) {
        try {
          const brandList = await getBrandsByCategory(3);
          setBrands(brandList);
        } catch (err) {
          console.error("Erreur chargement marques", err);
          setBrands([]);
        }
      } else {
        setBrands([]);
        setModels([]);
        setSelectedBrand("");
        setSelectedModel("");
      }
    };
    fetchBrands();
  }, [form.idCategory]);

  useEffect(() => {
    const fetchModels = async () => {
      if (form.idCategory === 3 && selectedBrand) {
        try {
          const modelList = await getModelsByCategoryAndBrand(3, selectedBrand);
          setModels(modelList);
        } catch (err) {
          console.error("Erreur chargement modèles", err);
          setModels([]);
        }
      } else {
        setModels([]);
        setSelectedModel("");
      }
    };
    fetchModels();
  }, [selectedBrand, form.idCategory]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    
    setForm({
      ...form,
      [name]: name === "idCategory" ? parseInt(value, 10) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.idCategory === 0) return;

    let equipmentId = undefined;

    // Si c'est la catégorie 3, on va chercher l'ID de l'équipement correspondant
    if (form.idCategory === 3) {
      if (!selectedBrand || !selectedModel) return; // Sécurité si champs vides
      
      const equipment = await findEquipmentByCriteria(3, selectedBrand, selectedModel);
      if (equipment && equipment.id) {
        equipmentId = equipment.id;
      } else {
        return; // Stoppe l'envoi si l'équipement n'est pas trouvé
      }
    }

    // On prépare le payload complet
    const payload: ProblemCreate = {
      ...form,
      idEquipment: equipmentId,
    };

    const created = await submitExecute(() => createProblem(payload));

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

          {form.idCategory === 3 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div>
                <label className="block font-semibold text-slate-700 mb-2">
                  Marque
                </label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 bg-white"
                  required
                >
                  <option value="">-- Choisir une marque --</option>
                  {brands.map((brandName) => (
                    <option key={brandName} value={brandName}>
                      {brandName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-2">
                  Modèle
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  disabled={!selectedBrand}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 bg-white disabled:opacity-50"
                  required
                >
                  <option value="">-- Choisir un modèle --</option>
                  {models.map((modelName) => (
                    <option key={modelName} value={modelName}>
                      {modelName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              maxLength={1000}
              value={form.description}
              onChange={handleChange}
              rows={6}
              placeholder="Expliquez votre problème...(max 1000 caractères)"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            disabled={submitting || loadingCats}
            className="w-full rounded-xl bg-blue-600 py-3 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50 cursor-pointer"
          >
            {submitting ? "Création..." : "Créer le problème"}
          </button>
        </form>
      </div>
    </div>
  );
}