import React, { useState } from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const [jumpPage, setJumpPage] = useState("");

  if (totalPages <= 1) return null;

  const handleJumpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = Number(jumpPage);
    if (pageNum >= 1 && pageNum <= totalPages) {
      onPageChange(pageNum);
      setJumpPage("");
    }
  };

  // Logique pour afficher un nombre limité de pages autour de la page courante
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, currentPage + 2);

      if (currentPage <= 3) {
        end = Math.min(totalPages, maxPagesToShow);
      } else if (currentPage >= totalPages - 2) {
        start = Math.max(1, totalPages - maxPagesToShow + 1);
      }

      if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push("...");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages) {
        if (end < totalPages - 1) pages.push("...");
      }
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 border-t border-slate-200">
      {/* Infos de pagination */}
      <div className="text-sm text-slate-500">
        Page <span className="font-semibold text-slate-900">{currentPage}</span> sur{" "}
        <span className="font-semibold text-slate-900">{totalPages}</span>
      </div>

      {/* Boutons de navigation */}
      <div className="flex items-center gap-1.5 flex-wrap justify-center">
        {/* Aller au début */}
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition"
          title="Première page"
        >
          &laquo;&laquo;
        </button>

        {/* Page précédente */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition"
        >
          Précédent
        </button>

        {/* Numéros de page dynamiques */}
        {getPageNumbers().map((page, index) =>
          typeof page === "number" ? (
            <button
              key={index}
              type="button"
              onClick={() => onPageChange(page)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border cursor-pointer transition ${
                currentPage === page
                  ? "bg-blue-600 border-blue-600 text-white shadow-xs"
                  : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
              }`}
            >
              {page}
            </button>
          ) : (
            <span key={index} className="px-2 text-slate-400 font-semibold text-xs">
              {page}
            </span>
          )
        )}

        {/* Page suivante */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition"
        >
          Suivant
        </button>

        {/* Aller à la fin */}
        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition"
          title="Dernière page"
        >
          &raquo;&raquo;
        </button>
      </div>

      {/* Input de saut direct vers une page */}
      <form onSubmit={handleJumpSubmit} className="flex items-center gap-2">
        <span className="text-xs text-slate-500">Aller à :</span>
        <input
          type="number"
          min="1"
          max={totalPages}
          value={jumpPage}
          onChange={(e) => setJumpPage(e.target.value)}
          placeholder="N°"
          className="w-16 px-2 py-1 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-500 text-center"
        />
        <button
          type="submit"
          className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 cursor-pointer transition"
        >
          OK
        </button>
      </form>
    </div>
  );
}