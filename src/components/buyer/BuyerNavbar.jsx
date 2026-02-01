"use client";

import { useState, useEffect } from "react";
import { Search, Bell, ShoppingCart, X, Wallet } from "lucide-react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import { useAppContext } from "@/lib/AppContext";

export function BuyerNavbar({ onNavigate, onLogout }) {
  const { cart, notifications, notificationUnreadCount, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification, currentUser, walletBalance } = useAppContext();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const unreadNotifications = notificationUnreadCount || 0;
  
  useEffect(() => {
    console.log('[BuyerNavbar] Render - notificationUnreadCount:', notificationUnreadCount, 'unreadNotifications:', unreadNotifications);
  }, [notificationUnreadCount, unreadNotifications]);

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markNotificationAsRead(notification.id);
    }
  };

  const handleDeleteNotification = (id, e) => {
    e.stopPropagation();
    deleteNotification(id);
  };

  const getNotificationIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "task":
        return "📋";
      case "weather":
        return "🌦️";
      case "payment":
        return "💰";
      case "order":
        return "📦";
      case "system":
        return "⚙️";
      case "scheme":
        return "🏛️";
      case "product":
        return "🌾";
      case "rating":
        return "⭐";
      case "user":
        return "👤";
      default:
        return "🔔";
    }
  };

  // Generate user avatar based on backend data
  const getUserAvatar = () => {
    if (currentUser?.profileImageUrl) {
      return currentUser.profileImageUrl;
    }
    // Generate avatar based on user name or email
    const seed = `${currentUser?.firstName} ${currentUser?.lastName}` || currentUser?.email || 'buyer';
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`;
  };

  const getUserInitials = () => {
    if (currentUser?.firstName && currentUser?.lastName) {
      return (currentUser.firstName[0] + currentUser.lastName[0]).toUpperCase();
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
        {/* Wallet Balance */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
          <Wallet className="w-4 h-4 text-green-600 dark:text-green-400" />
          <span className="text-sm font-semibold text-green-600 dark:text-green-400">
            ₹{walletBalance?.toLocaleString('en-IN') || '0'}
          </span>
        </div>

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

        {/* Notifications Popover */}
        <Popover open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5 text-muted-foreground" />
              {unreadNotifications > 0 && (
                <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-destructive text-xs">
                  {unreadNotifications}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-96 p-0" align="end">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Notifications</h3>
                <div className="flex items-center gap-2">
                  {unreadNotifications > 0 && (
                    <>
                      <Badge variant="secondary">{unreadNotifications} new</Badge>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-xs h-7"
                        onClick={(e) => {
                          e.stopPropagation();
                          markAllNotificationsAsRead();
                        }}
                      >
                        Clear all
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="max-h-[400px] overflow-y-auto">
              {notifications.filter(n => !n.read).length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No new notifications</p>
                </div>
              ) : (
                <div className="divide-y border-t">
                  {notifications.filter(n => !n.read).map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-secondary cursor-pointer transition-colors ${!notification.read ? "bg-primary/5" : ""}`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-2xl mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-medium text-sm">{notification.title}</p>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 shrink-0"
                              onClick={(e) => handleDeleteNotification(notification.id, e)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {notification.timestamp}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-primary rounded-full shrink-0 mt-2" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>

        <div className="h-8 w-px bg-border mx-2" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 pr-1">
              <span className="text-sm font-medium hidden sm:inline-block">
                {currentUser?.firstName} {currentUser?.lastName || "Buyer User"}
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
