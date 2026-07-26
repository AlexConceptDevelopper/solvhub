import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { createSolution } from "../api/solution.api";

import type { SolutionCreate } from "../types/solutionCreate";
import ErrorMessage from "../components/ErrorMessage";
import BackButton from "../components/BackButton";
import PrimaryButton from "../components/PrimaryButton";

export default function CreateSolutionPage() {
  const navigate = useNavigate();
  const { problemId } = useParams();
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<SolutionCreate>({
    title: "",
    steps: "",
    difficulty: 1,
    timeMinutes: 5,
    riskLevel: 1,
    problemId: Number(problemId),
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === "number"
          ? Number(e.target.value)
          : Number.isNaN(Number(e.target.value))
            ? e.target.value
            : Number(e.target.value),
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      const created = await createSolution(form);

      navigate(`/solution/${created.idSolution}`);
    } catch (error) {
      console.error(error);

      setError("Impossible de créer la solution");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        max-w-3xl
        mx-auto
      "
    >
      <div
        className="
          bg-white/80
          backdrop-blur
          rounded-3xl
          border
          border-slate-200
          shadow-md
          p-8
        "
      >
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-800">
            Proposer une solution
          </h1>
          <BackButton to={`/problem/${problemId}`} label="Retour au problème" />
        </div>

        {error && (
          <ErrorMessage message={error} onRetry={() => setError(null)} />
        )}

        <form
          onSubmit={handleSubmit}
          className="
            mt-8
            space-y-6
          "
        >
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Titre de la solution"
            className="
              w-full
              rounded-xl
              border
              px-4
              py-3
            "
            required
          />

          <textarea
            name="steps"
            maxLength={2000}
            value={form.steps}
            onChange={handleChange}
            placeholder="Décrivez les étapes...(max 2000 caractères)"
            className="
              w-full
              rounded-xl
              border
              px-4
              py-3
              h-40
            "
            required
          />

          <select
            name="difficulty"
            value={form.difficulty}
            onChange={handleChange}
            className="
                w-full
                rounded-xl
                border
                px-4
                py-3
            "
          >
            <option value={1}>1 - Très facile</option>

            <option value={2}>2 - Facile</option>

            <option value={3}>3 - Moyen</option>

            <option value={4}>4 - Difficile</option>

            <option value={5}>5 - Très difficile</option>
          </select>

          <select
            name="timeMinutes"
            value={form.timeMinutes}
            onChange={handleChange}
            className="
                w-full
                rounded-xl
                border
                px-4
                py-3
            "
          >
            <option value={5}>Moins de 10 minutes</option>

            <option value={15}>10 à 30 minutes</option>

            <option value={45}>30 minutes à 1 heure</option>

            <option value={120}>Plus d'une heure</option>
          </select>

          <select
            name="riskLevel"
            value={form.riskLevel}
            onChange={handleChange}
            className="
                w-full
                rounded-xl
                border
                px-4
                py-3
            "
          >
            <option value={1}>1 - Aucun risque</option>

            <option value={2}>2 - Faible risque</option>

            <option value={3}>3 - Risque modéré</option>

            <option value={4}>4 - Risque important</option>

            <option value={5}>5 - Danger élevé</option>
          </select>

          <PrimaryButton
            type="submit"
            loading={loading}
            loadingLabel="Création..."
            className="w-full"
          >
            Créer la solution
          </PrimaryButton>
        </form>
      </div>
    </div>
  );
}
