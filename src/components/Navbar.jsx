import { useState, useEffect } from "react";
import { Search, Bell, CloudSun, X, Wallet } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import { useAppContext } from "@/lib/AppContext";

export function Navbar({ onNavigate }) {
  const { notifications, notificationUnreadCount, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification, currentUser, currentWeather, walletBalance } = useAppContext();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const unreadCount = notificationUnreadCount || 0;
  
  useEffect(() => {
    console.log('[Navbar] Render - notificationUnreadCount:', notificationUnreadCount, 'unreadCount:', unreadCount);
  }, [notificationUnreadCount, unreadCount]);

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

  return (
    <div className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
      {/* Search Bar */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks, crops, transactions..."
            className="pl-10 bg-input-background"
          />
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* Wallet Balance */}
        <div className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-950 rounded-xl border border-green-200 dark:border-green-800">
          <Wallet className="w-4 h-4 text-green-600 dark:text-green-400" />
          <div>
            <p className="text-xs text-muted-foreground">Wallet</p>
            <p className="text-sm font-semibold text-green-600 dark:text-green-400">
              ₹{walletBalance?.toLocaleString('en-IN') || '0'}
            </p>
          </div>
        </div>

        {/* Weather Summary */}
        <div className="flex items-center gap-2 px-3 py-2 bg-secondary rounded-xl">
          <CloudSun className="w-5 h-5 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">
              {currentWeather?.name || currentUser?.city || 'Punjab'}, {currentWeather?.sys?.country || 'India'}
            </p>
            <p className="text-sm">
              {currentWeather?.main?.temp ? `${Math.round(currentWeather.main.temp)}°C` : '28°C'}
            </p>
          </div>
        </div>

        {/* Notifications Popover */}
        <Popover open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-destructive text-xs">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-96 p-0" align="end">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Notifications</h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <>
                      <Badge variant="secondary">{unreadCount} new</Badge>
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
                      className={`p-4 hover:bg-secondary cursor-pointer transition-colors ${!notification.read ? "bg-primary/5" : ""
                        }`}
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

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={currentUser?.profileImageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.firstName || 'farmer'}`} />
                <AvatarFallback>{currentUser?.firstName ? currentUser.firstName[0].toUpperCase() : "U"}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{currentUser?.fullName || currentUser?.firstName || "User"}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onNavigate("settings")}>
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onNavigate("ratings")}>
              Ratings & Reviews
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}


