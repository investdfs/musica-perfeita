
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Cadastro from "./pages/Cadastro";
import Login from "./pages/Login";
import Sobre from "./pages/Sobre";
import Dashboard from "./pages/Dashboard";
import Pagamento from "./pages/Pagamento";
import Confirmacao from "./pages/Confirmacao";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import MusicPreview from "./pages/MusicPreview";
import MinhaMusica from "./pages/MinhaMusica";
import NotFound from "./pages/NotFound";
import MusicPlayer from "./pages/MusicPlayer";
import MusicPlayerFull from "./pages/MusicPlayerFull";
import AuthGuard from "./components/auth/AuthGuard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename="/">
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
            <Route path="/music-preview" element={<MusicPreview />} />
            <Route path="/minha-musica" element={<MinhaMusica />} />
            <Route path="/music-player" element={<MusicPlayer />} />
            <Route path="/music-player-full" element={<MusicPlayerFull />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthGuard>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
