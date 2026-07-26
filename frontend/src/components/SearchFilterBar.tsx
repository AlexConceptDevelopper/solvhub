export interface CategoryOption {
  name: string;
  count: number;
}

interface SearchFilterBarProps {
  search: string;
  setSearch: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  uniqueCategories: CategoryOption[];
  placeholder?: string;
}

export default function SearchFilterBar({
  search,
  setSearch,
  category,
  setCategory,
  uniqueCategories,
  placeholder = "Rechercher (3 lettres min)...",
}: SearchFilterBarProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={placeholder}
        className="flex-1 rounded-xl border border-slate-300 px-4 py-3 bg-white shadow-sm focus:outline-blue-500"
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="rounded-xl border border-slate-300 px-4 py-3 bg-white cursor-pointer shadow-sm focus:outline-blue-500"
      >
        <option value="Toutes">Toutes les catégories</option>
        {uniqueCategories.map((cat) => (
          <option key={cat.name} value={cat.name}>
            {cat.name} ({cat.count})
          </option>
        ))}
      </select>
    </div>
  );
}