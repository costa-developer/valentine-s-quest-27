import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { FloatingHearts } from "@/components/FloatingHearts";
import { AdminDashboard } from "@/components/AdminDashboard";
import { toast } from "sonner";

const Admin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/admin/login");
        return;
      }
      
      setLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_OUT" || !session) {
          navigate("/admin/login");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-valentine-blush flex items-center justify-center">
        <p className="text-valentine-red text-xl animate-pulse">Loading... 💕</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-valentine-blush">
      <FloatingHearts />
      <AdminDashboard onLogout={handleLogout} />
    </div>
  );
};

export default Admin;
