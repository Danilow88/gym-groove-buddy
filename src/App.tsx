import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import Workout from "./pages/Workout";
import History from "./pages/History";
import Profile from "./pages/Profile";
import Timers from "./pages/Timers";
import Admin from "./pages/Admin";
import Login from "./pages/auth/Login";
import Chat from "./pages/Chat";
import Schedule from "./pages/Schedule";
import VideoCall from "./pages/VideoCall";
import Mobility from "./pages/Mobility";
import { useAuth } from "@/hooks/use-auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  if (isLoading) return null;
  return isAuthenticated ? children : <Navigate to="/login" replace state={{ from: location }} />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/workout" element={<PrivateRoute><Workout /></PrivateRoute>} />
          <Route path="/timers" element={<Timers />} />
          <Route path="/history" element={<PrivateRoute><History /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/admin" element={<PrivateRoute><Admin /></PrivateRoute>} />
          <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
          <Route path="/schedule" element={<PrivateRoute><Schedule /></PrivateRoute>} />
          <Route path="/call/:appointmentId" element={<PrivateRoute><VideoCall /></PrivateRoute>} />
          <Route path="/mobility" element={<PrivateRoute><Mobility /></PrivateRoute>} />
          {/* Planner removido: funcionalidade integrada na tela de Treino */}
          <Route path="/login" element={<Login />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
