import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Leaf, User, Lock } from "lucide-react";
import { toast } from "sonner";
import authService from "../services/authService";

export function Login({ onLogin, onSwitchToRegister }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    setLoading(true);

    try {
      const response = await authService.login(email, password);
      
      toast.success("Login successful!");
      
      // Call the onLogin callback if provided (to update AppContext)
      if (onLogin) {
        onLogin(response.user);
      }

      // Redirect based on user role
      const role = response.user.role?.toUpperCase();
      
      console.log('User role:', role); // Debug log
      console.log('Navigating to dashboard...'); // Debug log
      
      // Navigate immediately based on role
      switch (role) {
        case "FARMER":
          navigate("/farmer/dashboard", { replace: true });
          break;
        case "BUYER":
          navigate("/buyer/dashboard", { replace: true });
          break;
        case "ADMIN":
          navigate("/admin/dashboard", { replace: true });
          break;
        default:
          console.error('Unknown role:', role);
          navigate("/", { replace: true });
      }
    } catch (error) {
      toast.error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
              <Leaf className="w-10 h-10 text-primary-foreground" />
            </div>
          </div>
          <div>
            <h1 className="text-primary text-3xl font-bold">FarmLink</h1>
            <p className="text-muted-foreground uppercase tracking-widest text-xs font-semibold">Smart Farming Management</p>
          </div>
        </div>

        <Card className="shadow-xl border-none">
          <CardHeader>
            <CardTitle>Login to Your Account</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full shadow-lg" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>

            {onSwitchToRegister && (
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={onSwitchToRegister}
                    className="text-primary hover:underline font-semibold"
                  >
                    Register here
                  </button>
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground opacity-70">
          © 2025 FarmLink. All rights reserved.
        </p>
      </div>
    </div>
  );
}
