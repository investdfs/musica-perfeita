
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Cadastro from "./pages/Cadastro";
import Login from "./pages/Login";
import Sobre from "./pages/Sobre";
import Dashboard from "./pages/Dashboard";
import Pagamento from "./pages/Pagamento";
import Confirmacao from "./pages/Confirmacao";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import NotFound from "./pages/NotFound";
import MusicPlayer from "./pages/MusicPlayer";
import MusicPlayerFull from "./pages/MusicPlayerFull";
import NossasMusicas from "./pages/NossasMusicas";
import Depoimentos from "./pages/Depoimentos";
import FAQ from "./pages/FAQ";
import TermosCondicoes from "./pages/TermosCondicoes";
import PoliticaPrivacidade from "./pages/PoliticaPrivacidade";
import AuthGuard from "./components/auth/AuthGuard";
import { ThemeProvider } from "./components/theme/ThemeProvider";
import LanguageProvider from "./components/i18n/LanguageProvider";
import FakeNotifications from "./components/home/FakeNotifications";
import { useEffect } from "react";

const queryClient = new QueryClient();

// Componente para lidar com redirecionamentos de 404
const RedirectHandler = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Verifica se há um caminho armazenado no sessionStorage
    const redirectPath = sessionStorage.getItem('redirectPath');
    if (redirectPath) {
      // Remove do sessionStorage para não redirecionar novamente
      sessionStorage.removeItem('redirectPath');
      // Navega para o caminho armazenado
      navigate(redirectPath);
    }
  }, [navigate]);
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter basename="/">
            <RedirectHandler>
              <FakeNotifications />
              <AuthGuard>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/cadastro" element={<Cadastro />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/sobre" element={<Sobre />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/pagamento" element={<Pagamento />} />
                  <Route path="/confirmacao" element={<Confirmacao />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/admin-login" element={<AdminLogin />} />
                  <Route path="/music-player" element={<MusicPlayer />} />
                  <Route path="/music-player-full" element={<MusicPlayerFull />} />
                  <Route path="/nossas-musicas" element={<NossasMusicas />} />
                  <Route path="/depoimentos" element={<Depoimentos />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/termos-condicoes" element={<TermosCondicoes />} />
                  <Route path="/politica-privacidade" element={<PoliticaPrivacidade />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AuthGuard>
            </RedirectHandler>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
