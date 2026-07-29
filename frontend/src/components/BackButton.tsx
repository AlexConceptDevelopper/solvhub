import { useNavigate } from "react-router-dom";

type BackButtonProps = {
  to?: string | number;
  label?: string;
  className?: string;
  state?: any;
  replace?: boolean;
};

export default function BackButton({
  to = -1,
  label = "Retour",
  className = "",
  state,
  replace = false,
}: BackButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (typeof to === "number") {
      navigate(to);
    } else {
      navigate(to, { replace, state });
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`group inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-blue-600 hover:border-blue-300 hover:shadow-[0_0_12px_rgba(59,130,246,0.15)] transition-all duration-200 cursor-pointer ${className}`}
    >
      {label}
    </button>
  );
}