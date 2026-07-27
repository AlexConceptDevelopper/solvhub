
interface LoadingStateProps {
  label?: string;
}

export default function LoadingState({ label = "Chargement..." }: LoadingStateProps) {
  return (
    <div className="text-center text-slate-500 py-16 font-medium">
      {label}
    </div>
  );
}