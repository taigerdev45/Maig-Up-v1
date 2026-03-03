import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import Testimonials from "./pages/Testimonials";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminRegistrations from "./pages/admin/AdminRegistrations";
import AdminServices from "./pages/admin/AdminServices";
import AdminTestimonials from "./pages/admin/AdminTestimonials";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminAccueil from "./pages/admin/AdminAccueil";
import Maintenance from "./pages/Maintenance";
import { usePageVisit } from "./hooks/usePageVisit";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "./services/api";

const queryClient = new QueryClient();

function PageVisitTracker({ children }: { children: React.ReactNode }) {
  usePageVisit();
  return <>{children}</>;
}

function MaintenanceGuard({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname === '/login';

  const { data: remoteContent, isLoading } = useQuery({
    queryKey: ['public-content-maintenance'],
    queryFn: async () => {
      const { data } = await api.get('/content');
      return data;
    },
    staleTime: 60 * 1000 // Cache 1 minute pour le check de maintenance
  });

  if (isLoading && !isAdminRoute) {
    // Éviter un clignotement ou laisser blanc au premier chargement  
    return null;
  }

  const isMaintenanceMode = remoteContent?.settings?.maintenanceMode === true;

  if (isMaintenanceMode && !isAdminRoute) {
    return <Maintenance />;
  }

  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <PageVisitTracker>
          <MaintenanceGuard>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/a-propos" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/temoignages" element={<Testimonials />} />
              <Route path="/contact" element={<Contact />} />
              
              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="accueil" element={<AdminAccueil />} />
                <Route path="registrations" element={<AdminRegistrations />} />
                <Route path="services" element={<AdminServices />} />
                <Route path="testimonials" element={<AdminTestimonials />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </MaintenanceGuard>
        </PageVisitTracker>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
