import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  adminOnly?: boolean;
  redirectTo?: string;
}

const ProtectedRoute = ({ adminOnly = false, redirectTo = "/auth" }: ProtectedRouteProps) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          setIsAuthorized(false);
          return;
        }

        if (adminOnly) {
          // Verificar si el usuario tiene rol de admin
          const { data: roles, error } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", session.user.id)
            .eq("role", "admin")
            .maybeSingle();
          
          if (error || !roles) {
             setIsAuthorized(false);
          } else {
             setIsAuthorized(true);
          }
        } else {
          // Si no requiere admin, basta con estar logueado
          setIsAuthorized(true);
        }
      } catch (error) {
        console.error("Error de verificación de auth:", error);
        setIsAuthorized(false);
      }
    };

    checkAuth();
  }, [adminOnly]);

  // Estado de carga mientras verificamos permisos
  if (isAuthorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Si tiene permiso renderiza la ruta hija (Outlet), si no redirige
  return isAuthorized ? <Outlet /> : <Navigate to={redirectTo} replace />;
};

export default ProtectedRoute;