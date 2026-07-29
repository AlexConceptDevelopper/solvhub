interface SearchFilterBarProps {
  category: string;
  setCategory: (category: string) => void;
  uniqueCategories: { name: string; count: number }[];
}

export default function SearchFilterBar({
  category,
  setCategory,
  uniqueCategories,
}: SearchFilterBarProps) {
  // Votre composant de filtre par catégorie (onglets ou select)
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <button
        onClick={() => setCategory("Toutes")}
        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
          category === "Toutes"
            ? "bg-blue-600 text-white shadow-sm"
            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
        }`}
      >
        Toutes
      </button>
      {uniqueCategories.map((cat) => (
        <button
          key={cat.name}
          onClick={() => setCategory(cat.name)}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            category === cat.name
              ? "bg-blue-600 text-white shadow-sm"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          {cat.name} ({cat.count})
        </button>
      ))}
    </div>
  );
}