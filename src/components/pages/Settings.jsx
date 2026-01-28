"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { User, Mail, Phone, MapPin, Shield, Bell } from "lucide-react";
import { useAppContext } from "@/lib/AppContext";
import { toast } from "sonner";

export function Settings() {
  const { currentUser } = useAppContext();
  const [activeTab, setActiveTab] = useState("profile");

  // States for interactive tabs
  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    desktop: false,
    promotions: false
  });

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (securityData.newPassword !== securityData.confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }
    toast.success("Password updated successfully!");
    setSecurityData({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  const toggleNotification = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto pb-12">
      <div>
        <h1 className="text-3xl font-bold">Settings & Profile</h1>
        <p className="text-muted-foreground">Manage your account preferences and info.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <Card className="border-none shadow-sm text-center p-6 bg-white">
            <CardContent className="space-y-4 pt-0">
              <div className="w-24 h-24 bg-primary text-primary-foreground rounded-full mx-auto flex items-center justify-center text-3xl font-bold shadow-sm">
                {(currentUser?.firstName?.[0] || '') + (currentUser?.lastName?.[0] || '') || "BU"}
              </div>
              <div>
                <h2 className="text-xl font-bold">{currentUser?.firstName} {currentUser?.lastName || "Buyer User"}</h2>
                <p className="text-sm text-muted-foreground">Member since 2024</p>
              </div>
              <Button variant="outline" size="sm" className="w-full">Change Photo</Button>
            </CardContent>
          </Card>

          <nav className="flex flex-col gap-1">
            <Button
              variant={activeTab === "profile" ? "secondary" : "ghost"}
              className="justify-start gap-3"
              onClick={() => setActiveTab("profile")}
            >
              <User className="w-4 h-4" /> Personal Info
            </Button>
            <Button
              variant={activeTab === "security" ? "secondary" : "ghost"}
              className="justify-start gap-3"
              onClick={() => setActiveTab("security")}
            >
              <Shield className="w-4 h-4" /> Security
            </Button>
            <Button
              variant={activeTab === "notifications" ? "secondary" : "ghost"}
              className="justify-start gap-3"
              onClick={() => setActiveTab("notifications")}
            >
              <Bell className="w-4 h-4" /> Notifications
            </Button>
          </nav>
        </div>

        <div className="lg:col-span-2">
          {activeTab === "profile" && (
            <Card className="border-none shadow-sm bg-white">
              <CardHeader><CardTitle className="text-lg">Personal Information</CardTitle></CardHeader>
              <CardContent className="space-y-6 pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-bold">
                  <div className="space-y-2"><Label>First Name</Label><Input defaultValue={currentUser?.firstName || "John"} /></div>
                  <div className="space-y-2"><Label>Last Name</Label><Input defaultValue={currentUser?.lastName || "Smith"} /></div>
                  <div className="space-y-2"><Label>Email</Label><Input type="email" defaultValue={currentUser?.email || "john.smith@example.com"} /></div>
                  <div className="space-y-2"><Label>Phone</Label><Input type="tel" defaultValue="+91 98765 43210" /></div>
                  <div className="space-y-2"><Label>Location</Label><Input defaultValue="Ludhiana, Punjab" /></div>
                </div>
                <div className="space-y-2 font-bold">
                  <Label>Bio / Notes</Label>
                  <textarea className="w-full min-h-[100px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-primary" defaultValue="Active buyer searching for organic grains and vegetables from direct farm sources." />
                </div>
                <div className="flex justify-end pt-4 border-t gap-3">
                  <Button variant="outline">Discard</Button>
                  <Button onClick={() => toast.success("Profile updated!")}>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "security" && (
            <Card className="border-none shadow-sm bg-white">
              <CardHeader><CardTitle className="text-lg">Security Settings</CardTitle></CardHeader>
              <CardContent className="space-y-6 pt-0">
                <form onSubmit={handleUpdatePassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Current Password</Label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={securityData.currentPassword}
                      onChange={(e) => setSecurityData({ ...securityData, currentPassword: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>New Password</Label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={securityData.newPassword}
                      onChange={(e) => setSecurityData({ ...securityData, newPassword: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Confirm New Password</Label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={securityData.confirmPassword}
                      onChange={(e) => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
                    />
                  </div>
                  <div className="flex justify-end pt-4 border-t gap-3">
                    <Button type="submit">Update Password</Button>
                  </div>
                </form>
                <div className="flex items-center justify-between p-4 bg-muted/20 rounded-xl">
                  <div>
                    <p className="font-bold text-sm">Two-Factor Authentication</p>
                    <p className="text-xs text-muted-foreground">Extra layer of security.</p>
                  </div>
                  <div className="w-10 h-5 bg-slate-200 rounded-full cursor-not-allowed relative">
                    <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "notifications" && (
            <Card className="border-none shadow-sm bg-white">
              <CardHeader><CardTitle className="text-lg">Notifications</CardTitle></CardHeader>
              <CardContent className="space-y-6 pt-0">
                <div className="space-y-4">
                  {[
                    { key: "email", label: "Email Notifications", desc: "For orders and payments" },
                    { key: "sms", label: "SMS Alerts", desc: "Critical shipping alerts" },
                    { key: "desktop", label: "Desktop Notifications", desc: "Browser alerts" },
                    { key: "promotions", label: "Promotion Alerts", desc: "Weekly deals" }
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-sm tracking-tight">{item.label}</p>
                        <p className="text-[10px] text-muted-foreground uppercase font-medium">{item.desc}</p>
                      </div>
                      <div
                        className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${notifications[item.key] ? 'bg-primary' : 'bg-slate-200'}`}
                        onClick={() => toggleNotification(item.key)}
                      >
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${notifications[item.key] ? 'right-1' : 'left-1'}`}></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end pt-4 border-t gap-3">
                  <Button onClick={() => toast.success("Notification preferences saved!")}>Save Preferences</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
