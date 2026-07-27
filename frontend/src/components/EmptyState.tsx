// components/EmptyState.tsx
interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-12 text-center">
      {icon && <span className="text-3xl block mb-3">{icon}</span>}
      <p className="text-slate-700 font-semibold">{title}</p>
      {description && <p className="text-slate-500 text-sm mt-1">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}