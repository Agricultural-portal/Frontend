"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/lib/AppContext";
import { Bell, X, Wallet } from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
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
import { ScrollArea } from "../ui/scroll-area";
import { toast } from "sonner";

export function AdminNavbar({ onLogout }) {
  const navigate = useNavigate();
  const { notifications, notificationUnreadCount, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification, logout, walletBalance } = useAppContext();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
    if (onLogout) onLogout();
  };

  const unreadCount = notificationUnreadCount || 0;
  
  useEffect(() => {
    console.log('[AdminNavbar] Render - notificationUnreadCount:', notificationUnreadCount, 'unreadCount:', unreadCount);
  }, [notificationUnreadCount, unreadCount]);

  const handleNotificationClick = (notificationId) => {
    markNotificationAsRead(notificationId);
  };

  const handleClearNotification = (notificationId, e) => {
    e.stopPropagation();
    deleteNotification(notificationId);
  };

  const handleClearAll = () => {
    markAllNotificationsAsRead();
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "order": return "🛒";
      case "payment": return "💰";
      case "crop": return "🌾";
      case "weather": return "🌤️";
      case "scheme": return "📋";
      default: return "🔔";
    }
  };

  return (
    <div className="h-16 bg-card border-b border-border flex items-center justify-between px-6 shadow-sm">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Admin Console</h2>
        <p className="text-xs text-muted-foreground uppercase font-medium tracking-widest">Platform Management</p>
      </div>

      <div className="flex items-center gap-4">
        {/* Wallet Balance */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
          <Wallet className="w-4 h-4 text-green-600 dark:text-green-400" />
          <span className="text-sm font-semibold text-green-600 dark:text-green-400">
            ₹{walletBalance?.toLocaleString('en-IN') || '0'}
          </span>
        </div>

        <Popover open={showNotifications} onOpenChange={setShowNotifications}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative transition-transform hover:scale-110">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-destructive text-[10px] animate-pulse">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-96 p-0 border-none shadow-2xl rounded-2xl" align="end">
            <Card className="border-0 shadow-none rounded-2xl overflow-hidden">
              <CardHeader className="bg-primary/5 border-b py-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-bold">Notifications</CardTitle>
                  {notifications.filter(n => !n.read).length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearAll}
                      className="text-xs h-8 px-2 hover:bg-destructive/10 hover:text-destructive"
                    >
                      Clear All
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[400px]">
                  {notifications.filter(n => !n.read).length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Bell className="w-16 h-16 text-muted-foreground/20 mb-4" />
                      <p className="text-sm font-medium text-muted-foreground">All caught up!</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-border/50">
                      {notifications.filter(n => !n.read).map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 hover:bg-accent/50 cursor-pointer transition-colors relative group ${!notification.read ? "bg-primary/5 shadow-inner" : ""
                            }`}
                          onClick={() => handleNotificationClick(notification.id)}
                        >
                          <button
                            onClick={(e) => handleClearNotification(notification.id, e)}
                            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-background p-1 rounded-full shadow-sm hover:text-destructive"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          <div className="flex gap-4">
                            <div className="text-2xl pt-1">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0 pr-4">
                              <div className="flex items-center gap-2 mb-1">
                                <p className={`text-sm ${!notification.read ? "font-bold" : "font-medium"}`}>{notification.title}</p>
                                {!notification.read && <div className="w-1.5 h-1.5 bg-primary rounded-full" />}
                              </div>
                              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                {notification.message}
                              </p>
                              <p className="text-[10px] text-muted-foreground mt-2 uppercase tracking-wide">
                                {new Date(notification.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(notification.timestamp).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </PopoverContent>
        </Popover>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2 hover:bg-accent rounded-full transition-colors">
              <Avatar className="w-8 h-8 ring-2 ring-primary/10">
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin" />
                <AvatarFallback className="bg-primary text-primary-foreground font-bold">AD</AvatarFallback>
              </Avatar>
              <span className="text-sm font-bold hidden md:inline-block">Admin User</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 mt-2 rounded-xl shadow-xl border-none p-1">
            <DropdownMenuLabel className="px-3 py-2 font-bold opacity-70">My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border/50" />
            <DropdownMenuItem 
              onClick={() => navigate("/admin/settings?tab=profile")} 
              className="rounded-lg px-3 py-2 cursor-pointer gap-2"
            >
              <div className="w-1 h-4 bg-primary rounded-full" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => navigate("/admin/settings?tab=settings")} 
              className="rounded-lg px-3 py-2 cursor-pointer gap-2"
            >
              <div className="w-1 h-4 bg-chart-4 rounded-full" />
              System Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border/50" />
            <DropdownMenuItem onClick={handleLogout} className="rounded-lg px-3 py-2 cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive font-bold gap-2">
              <X className="w-4 h-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
