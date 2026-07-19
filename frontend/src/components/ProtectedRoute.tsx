import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// On retire le typage explicite de ReactNode, 
// React inférera automatiquement que children est un composant React
export const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" />;
};

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAdmin } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return isAdmin ? <>{children}</> : <Navigate to="/" />;
};