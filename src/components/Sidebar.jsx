import {
  Home,
  ListTodo,
  Sprout,
  Wallet,
  ShoppingBag,
  Cloud,
  Award,
  Settings,
  LogOut,
  Leaf,
  Star,
} from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

export function Sidebar({ currentPage, onNavigate, onLogout }) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "tasks", label: "My Tasks", icon: ListTodo },
    { id: "crops", label: "Crop Cycles", icon: Sprout },
    { id: "finances", label: "Finances", icon: Wallet },
    { id: "products", label: "My Products / Orders", icon: ShoppingBag },
    { id: "weather", label: "Weather", icon: Cloud },
    { id: "schemes", label: "Government Schemes", icon: Award },
    { id: "ratings", label: "Ratings & Reviews", icon: Star },
    { id: "settings", label: "Settings / Profile", icon: Settings },
  ];

  return (
    <div className="w-64 bg-card border-r border-border h-screen flex flex-col">
      {/* Logo and Brand */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <Leaf className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-primary font-bold">FarmLink</h1>
            <p className="text-xs text-muted-foreground">Smart Farming</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-foreground hover:bg-secondary"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          onClick={onLogout}
          className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </Button>
      </div>
    </div>
  );
}


