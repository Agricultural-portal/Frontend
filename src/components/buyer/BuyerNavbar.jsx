"use client";

import { Search, Bell, ShoppingCart } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useAppContext } from "@/lib/AppContext";

export function BuyerNavbar({ onNavigate, onLogout }) {
  const { cart, notifications, currentUser } = useAppContext();

  const unreadNotifications = notifications.filter(n => !n.read).length;

  // Generate user avatar based on backend data
  const getUserAvatar = () => {
    if (currentUser?.profileImageUrl) {
      return currentUser.profileImageUrl;
    }
    // Generate avatar based on user name or email
    const seed = currentUser?.name || currentUser?.email || 'buyer';
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`;
  };

  const getUserInitials = () => {
    if (currentUser?.name) {
      return currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    return 'BU';
  };

  return (
    <div className="h-16 bg-card border-b border-border flex items-center justify-between px-6 shadow-sm sticky top-0 z-30">
      <div className="flex-1 max-w-md">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors" />
          <Input
            placeholder="Search products, farmers..."
            className="pl-10 bg-muted/50 border-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          onClick={() => onNavigate("cart")}
        >
          <ShoppingCart className="w-5 h-5 text-muted-foreground" />
          {cart.length > 0 && (
            <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-primary text-xs">
              {cart.length}
            </Badge>
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="relative"
          onClick={() => onNavigate("notifications")}
        >
          <Bell className="w-5 h-5 text-muted-foreground" />
          {unreadNotifications > 0 && (
            <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-destructive text-xs">
              {unreadNotifications}
            </Badge>
          )}
        </Button>

        <div className="h-8 w-px bg-border mx-2" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 pr-1">
              <span className="text-sm font-medium hidden sm:inline-block">
                {currentUser?.name || "Buyer User"}
              </span>
              <Avatar className="w-8 h-8">
                <AvatarImage src={getUserAvatar()} />
                <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onNavigate("profile")}>Profile Settings</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onNavigate("orders")}>My Orders</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onNavigate("settings")}>Security Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout} className="text-destructive">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
