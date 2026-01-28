"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Bell, CheckCheck, ListTodo, Cloud, Wallet, Settings } from "lucide-react";
import { mockNotifications } from "@/lib/mockData";

export function Notifications() {
  const getNotificationIcon = (type) => {
    switch (type) {
      case "task": return ListTodo;
      case "weather": return Cloud;
      case "payment": return Wallet;
      case "system": return Settings;
      default: return Bell;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "task": return "bg-blue-100 text-blue-700";
      case "weather": return "bg-yellow-100 text-yellow-700";
      case "payment": return "bg-green-100 text-green-700";
      case "system": return "bg-purple-100 text-purple-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  const unreadCount = mockNotifications.filter((n) => !n.read).length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">
            {unreadCount > 0 ? `You have ${unreadCount} unread notifications` : "All caught up!"}
          </p>
        </div>
        <Button variant="outline" className="gap-2 font-bold">
          <CheckCheck className="w-4 h-4" />
          Mark All as Read
        </Button>
      </div>

      <div className="space-y-4">
        {mockNotifications.map((notification) => {
          const Icon = getNotificationIcon(notification.type);
          return (
            <Card
              key={notification.id}
              className={`border-none shadow-sm ${notification.read ? "opacity-60" : "bg-white"}`}
            >
              <CardContent className="p-4 flex items-start gap-4">
                <div className={`p-3 rounded-xl ${getTypeColor(notification.type)}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-start justify-between">
                    <h3 className="font-bold">{notification.title}</h3>
                    <Badge variant="secondary" className="capitalize">{notification.type}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{notification.message}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground">{notification.timestamp}</span>
                    {!notification.read && (
                      <Button variant="ghost" size="sm" className="h-8 text-xs font-bold">Mark as read</Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader><CardTitle className="text-lg">Notification Settings</CardTitle></CardHeader>
        <CardContent className="space-y-4 pt-0">
          <p className="text-sm text-muted-foreground">Manage which alerts you want to receive.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "Task Reminders", icon: ListTodo },
              { label: "Weather Alerts", icon: Cloud },
              { label: "Payment Updates", icon: Wallet },
              { label: "System Updates", icon: Settings }
            ].map((pref, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                <div className="flex items-center gap-3">
                  <pref.icon className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">{pref.label}</span>
                </div>
                <input type="checkbox" defaultChecked />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
