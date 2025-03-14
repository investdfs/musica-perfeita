import { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { UserProfile } from "@/types/database.types";
import { Toaster } from "@/components/ui/toaster";
import ScrollToTopButton from "@/components/ui/scroll-to-top-button";
import Loading from "@/components/Loading";

// Páginas carregadas diretamente
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFoundPage from "./pages/NotFoundPage";

// Páginas carregadas com lazy loading
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const MusicCatalogPage = lazy(() => import("./pages/MusicCatalogPage"));
const MusicPlayer = lazy(() => import("./pages/MusicPlayer"));
const MusicPlayerFull = lazy(() => import("./pages/MusicPlayerFull"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage"));

function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (user: UserProfile) => {
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/cadastro" element={<RegisterPage onRegister={handleLogin} />} />
          <Route path="/dashboard" element={
            user ? <DashboardPage userProfile={user} onLogout={handleLogout} /> : <Navigate to="/login" />
          } />
          <Route path="/admin" element={
            user?.is_admin ? <AdminPage userProfile={user} onLogout={handleLogout} /> : <Navigate to="/login" />
          } />
          <Route path="/pagamento" element={<CheckoutPage userProfile={user} />} />
          <Route path="/sobre" element={<AboutPage />} />
          <Route path="/contato" element={<ContactPage />} />
          <Route path="/nossas-musicas" element={<MusicCatalogPage />} />
          <Route path="/music-player" element={<MusicPlayer />} />
          <Route path="/music-player-full" element={<MusicPlayerFull />} />
          <Route path="/privacidade" element={<PrivacyPage />} />
          <Route path="/termos" element={<TermsPage />} />
          <Route path="/recuperar-senha" element={<ForgotPasswordPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      <ScrollToTopButton />
      <Toaster />
    </Router>
  );
}

export default App;
