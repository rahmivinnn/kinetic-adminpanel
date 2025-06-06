import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminPanel from "./pages/AdminPanel";
import DataManagement from "./pages/DataManagement";
import SuperAdminPanel from "./pages/SuperAdminPanel";
import FinancialDashboard from "./pages/FinancialDashboard";
import Appointments from "./pages/Appointments";
import MyPatients from "./pages/MyPatients";
import Exercises from "./pages/Exercises";
import AIAnalysis from "./pages/AIAnalysis";
import Reports from "./pages/Reports";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Protected routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } />
            
            <Route path="/admin" element={
              <ProtectedRoute requiredRole={['admin', 'super_admin']}>
                <AdminPanel />
              </ProtectedRoute>
            } />
            
            <Route path="/super-admin" element={
              <ProtectedRoute requiredRole="super_admin">
                <SuperAdminPanel />
              </ProtectedRoute>
            } />
            
            <Route path="/financial" element={
              <ProtectedRoute requiredRole={['admin', 'super_admin']}>
                <FinancialDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/data-management" element={
              <ProtectedRoute requiredRole={['admin', 'super_admin']}>
                <DataManagement />
              </ProtectedRoute>
            } />
            
            <Route path="/appointments" element={
              <ProtectedRoute>
                <Appointments />
              </ProtectedRoute>
            } />
            
            <Route path="/my-patients" element={
              <ProtectedRoute requiredRole={['provider', 'admin', 'super_admin']}>
                <MyPatients />
              </ProtectedRoute>
            } />
            
            <Route path="/exercises" element={
              <ProtectedRoute>
                <Exercises />
              </ProtectedRoute>
            } />
            
            <Route path="/ai-analysis" element={
              <ProtectedRoute requiredRole={['provider', 'admin', 'super_admin']}>
                <AIAnalysis />
              </ProtectedRoute>
            } />
            
            <Route path="/reports" element={
              <ProtectedRoute requiredRole={['admin', 'super_admin']}>
                <Reports />
              </ProtectedRoute>
            } />
            
            <Route path="/notifications" element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            } />
            
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
