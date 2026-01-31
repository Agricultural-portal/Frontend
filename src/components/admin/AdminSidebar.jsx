"use client";

import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Settings,
  LogOut,
  Shield,
  Award,
  Package,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useAppContext } from "@/lib/AppContext";

export function AdminSidebar({ currentPage, onNavigate, onLogout }) {
  const navigate = useNavigate();
  const { logout } = useAppContext();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
    if (onLogout) onLogout();
  };

  return (
    <div className="w-64 bg-card border-r border-border h-screen flex flex-col">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-primary font-bold">Admin Panel</h1>
            <p className="text-xs text-muted-foreground uppercase tracking-tighter">FarmLink System</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1">
          {[
            { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
            { id: "farmers", label: "Manage Farmers", icon: Users },
            { id: "buyers", label: "Manage Buyers", icon: ShoppingBag },
            { id: "orders", label: "All Orders", icon: Package },
            { id: "schemes", label: "Gov. Schemes", icon: Award },
            { id: "settings", label: "System Settings", icon: Settings },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "text-foreground hover:bg-secondary"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </Button>
      </div>
    </div>
  );
}
