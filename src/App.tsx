import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppLayout } from "@/components/AppLayout";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import ResetPassword from "./pages/ResetPassword";
// Pages
import Monitoring from "./pages/Monitoring";
import UserManagement from "./pages/UserManagement";
import FileUpload from "./pages/FileUpload";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";
import Login from "./pages/Login";
import Log from "./pages/Log"

// ProtectedRoute
import ProtectedRoute from "@/components/ProtectedRoute";

const queryClient = new QueryClient();

function HomeRedirect() {
  const { user, loading } = useAuth();

  if (loading) return null; 

  if (!user) return <Navigate to="/login" replace />;

  return <Navigate to="/upload" replace />;
}
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Login không dùng layout */}
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            {/* Redirect "/" theo role */}
            <Route path="/" element={<HomeRedirect />} />

            {/* Các route có sidebar + layout */}
            <Route
              path="/*"
              element={
                <SidebarProvider defaultOpen={true}>
                  <AppLayout>
                    <Routes>
                      
                      <Route path="/monitoring" element={
                        <ProtectedRoute allowedRoles={["admin", "user"]}>
                          <Monitoring />
                        </ProtectedRoute>
                      } />
                      <Route path="/upload" element={
                        <ProtectedRoute allowedRoles={["admin", "user"]}>
                          <FileUpload />
                        </ProtectedRoute>} />
                      <Route
                        path="/users"
                        element={
                          <ProtectedRoute allowedRoles={["admin"]}>
                            <UserManagement />
                          </ProtectedRoute>
                        }
                      />
                       <Route path="/activity" element={
                        <ProtectedRoute allowedRoles={["admin", "user"]}>
                          <Log />
                        </ProtectedRoute>
                      } />
                      <Route path="/unauthorized" element={<Unauthorized />} />
                      
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </AppLayout>
                </SidebarProvider>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
