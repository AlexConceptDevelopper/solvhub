import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <p className="text-slate-500 font-medium">Chargement de la session...</p>
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <p className="text-slate-500 font-medium">Vérification des droits...</p>
      </div>
    );
  }

  // 2. Ensuite on vérifie les rôles
  if (!user) return <Navigate to="/login" replace />;
  return isAdmin ? <>{children}</> : <Navigate to="/" replace />;
};