import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Lock, Mail } from "lucide-react";
import { toast } from "sonner";
import { FloatingHearts } from "@/components/FloatingHearts";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if already logged in
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/admin");
      }
    };
    checkSession();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // First try to sign in
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      // If login fails, try to create account (first time setup)
      if (signInError.message.includes("Invalid login credentials")) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) {
          toast.error("Login failed: " + signUpError.message);
        } else {
          // After signup, sign in
          const { error: retryError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          
          if (retryError) {
            toast.error("Login failed: " + retryError.message);
          } else {
            toast.success("Account created! Welcome! 💕");
            navigate("/admin");
          }
        }
      } else {
        toast.error("Login failed: " + signInError.message);
      }
    } else {
      toast.success("Welcome back! 💕");
      navigate("/admin");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-valentine-blush flex items-center justify-center p-4">
      <FloatingHearts />
      
      <Card className="w-full max-w-md border-2 border-valentine-rose bg-card/95 backdrop-blur-sm shadow-xl relative z-10">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Heart className="w-8 h-8 text-valentine-red fill-current animate-pulse-love" />
            <CardTitle className="text-2xl font-romantic text-valentine-red">
              Admin Login
            </CardTitle>
            <Heart className="w-8 h-8 text-valentine-red fill-current animate-pulse-love" />
          </div>
          <p className="text-muted-foreground">
            Sign in to see her responses 💌
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <Button
              type="submit"
              variant="valentine"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In 💕"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
