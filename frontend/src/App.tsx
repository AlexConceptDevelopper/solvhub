import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop";
import Footer from "./components/Footer"; 

import { PrivateRoute, AdminRoute } from "./components/ProtectedRoute";

import HomePage from "./pages/HomePage";
import ProblemsPage from "./pages/ProblemsPage";
import ProblemDetailPage from "./pages/ProblemDetailPage";
import CreateProblemPage from "./pages/CreateProblemPage";
import SolutionDetailPage from "./pages/SolutionDetailPage";
import CreateSolutionPage from "./pages/CreateSolutionPage";
import CategoryProblemsPage from "./pages/CategoryProblemsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import VerifyPage from "./pages/VerifyPage";
import ProfilePage from "./pages/ProfilePage";
import AdminDashboard from "./pages/AdminDashboard";
import CategoriesPage from "./pages/CategoriesPage";
import RankingHubPage from "./pages/RankingHubPage";
import RankingSolutionsPage from "./pages/RankingSolutionsPage";
import RankingContributorPage from "./pages/RankingContributorPage";
import UserProfilePage from "./pages/UserProfilePage";
import RankingProblemPage from "./pages/RankingProblemPage";
import LegalNotice from "./pages/LegalNotice";
import CGU from "./pages/CGU";
import Privacy from "./pages/Privacy";
import OAuthSuccessPage from "./pages/OAuthSuccessPage";

function AppRoutes() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Helmet>
        <title>SolvHub | Résolution de pannes et problèmes techniques</title>
        <meta name="description" content="Trouvez et partagez des solutions à vos problèmes techniques, matériels ou informatiques sur SolvHub." />
      </Helmet>
      
      <div className="min-h-screen flex flex-col bg-linear-to-br from-slate-100 via-blue-50 to-indigo-100">
        
        <Navbar />

        <main className="flex-1 px-4 md:px-8 py-8 max-w-7xl mx-auto w-full">
          <Routes>
            {/* Routes Publiques */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/oauth-success" element={<OAuthSuccessPage />} />
            <Route path="/verify" element={<VerifyPage />} />
            <Route path="/problems" element={<ProblemsPage />} />
            <Route path="/problem/:id" element={<ProblemDetailPage />} />
            <Route path="/solution/:id" element={<SolutionDetailPage />} />
            <Route path="/categories/:idCategory" element={<CategoryProblemsPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/ranking" element={<RankingHubPage />} />
            <Route path="/ranking/solutions" element={<RankingSolutionsPage />} />
            <Route path="/ranking/contributors" element={<RankingContributorPage />} />
            <Route path="/user/:id" element={<UserProfilePage />} />
            <Route path="/ranking/problems" element={<RankingProblemPage />} />

            {/* Routes Légales */}
            <Route path="/legal" element={<LegalNotice />} />
            <Route path="/cgu" element={<CGU />} />
            <Route path="/privacy" element={<Privacy />} />

            {/* Routes Authentifiées */}
            <Route path="/profile" element={
              <PrivateRoute><ProfilePage /></PrivateRoute>
            } />
            <Route path="/problem/create" element={
              <PrivateRoute><CreateProblemPage /></PrivateRoute>
            } />
            <Route path="/problem/:problemId/create-solution" element={
              <PrivateRoute><CreateSolutionPage /></PrivateRoute>
            } />

            {/* Routes Admin */}
            <Route path="/admin" element={
              <AdminRoute><AdminDashboard /></AdminRoute>
            } />
          </Routes>
        </main>

        <Footer />
        
      </div>
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;