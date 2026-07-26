// components/BackButton.tsx
import { useNavigate } from "react-router-dom";

type BackButtonProps = {
  to?: string | number;
  label?: string;
  className?: string;
};

export default function BackButton({
  to = -1,
  label = "Retour",
  className = "",
}: BackButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(to as any);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`group inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-blue-600 hover:border-blue-300 hover:shadow-[0_0_12px_rgba(59,130,246,0.15)] transition-all duration-200 cursor-pointer ${className}`}
    >
      <svg
        className="w-3.5 h-3.5 transform group-hover:-translate-x-0.5 transition-transform"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.5}
          d="M15 19l-7-7 7-7"
        />
      </svg>
      {label}
    </button>
  );
}