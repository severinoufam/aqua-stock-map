import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import Dashboard from "./pages/Dashboard";
import Itens from "./pages/Itens";
import Bombas from "./pages/Bombas";
import Movimentacoes from "./pages/Movimentacoes";
import Localizacao from "./pages/Localizacao";
import Relatorios from "./pages/Relatorios";
import Usuarios from "./pages/Usuarios";
import Alertas from "./pages/Alertas";
import NotFound from "./pages/NotFound";
import { AlmoxarifadoProvider } from "@/contexts/AlmoxarifadoContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AlmoxarifadoProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/itens" element={<Itens />} />
              <Route path="/bombas" element={<Bombas />} />
              <Route path="/movimentacoes" element={<Movimentacoes />} />
              <Route path="/localizacao" element={<Localizacao />} />
              <Route path="/relatorios" element={<Relatorios />} />
              <Route path="/usuarios" element={<Usuarios />} />
              <Route path="/alertas" element={<Alertas />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </AlmoxarifadoProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
