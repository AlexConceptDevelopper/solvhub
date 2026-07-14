import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createProblem } from "../api/problem.api";
import type { ProblemCreate, Problem } from "../types/problem";
import useAsync from "../hooks/useAsync";

export default function CreateProblemPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState<ProblemCreate>({
    title: "",
    description: "",
    category: "Informatique",
  });
  const { loading, error, execute } = useAsync<Problem>();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm({
      ...form,

      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    const created = await execute(() => createProblem(form));

    if (created) {
      navigate(`/problem/${created.idProblem}`);
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
        <h1
          className="
            text-3xl
            font-bold
            text-slate-800
          "
        >
          Poser un problème
        </h1>

        <p
          className="
            mt-2
            text-slate-500
          "
        >
          Décrivez votre problème pour obtenir de l'aide de la communauté.
        </p>

        {error && (
          <p
            className="
            mb-5
            text-red-600
            font-semibold
          "
          >
            {error}
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          className="
            mt-8
            space-y-6
          "
        >
          <div>
            <label
              className="
                block
                font-semibold
                text-slate-700
                mb-2
              "
            >
              Titre
            </label>

            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Ex : Mon PC ne démarre plus"
              className="
                w-full
                rounded-xl
                border
                border-slate-300
                px-4
                py-3
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
              "
              required
            />
          </div>

          <div>
            <label
              className="
                block
                font-semibold
                text-slate-700
                mb-2
              "
            >
              Catégorie
            </label>

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="
                w-full
                rounded-xl
                border
                border-slate-300
                px-4
                py-3
                bg-white
              "
            >
              <option>Informatique</option>

              <option>Maison</option>

              <option>Automobile</option>

              <option>Électronique</option>

              <option>Autre</option>
            </select>
          </div>

          <div>
            <label
              className="
                block
                font-semibold
                text-slate-700
                mb-2
              "
            >
              Description
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={6}
              placeholder="Expliquez votre problème..."
              className="
                w-full
                rounded-xl
                border
                border-slate-300
                px-4
                py-3
                resize-none
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
              "
              required
            />
          </div>

          <button
            disabled={loading}
            className="
              w-full
              rounded-xl
              bg-blue-600
              py-3
              text-white
              font-semibold
              hover:bg-blue-700
              transition
              disabled:opacity-50
            "
          >
            {loading ? "Création..." : "Créer le problème"}
          </button>
        </form>
      </div>
    </div>
  );
}
