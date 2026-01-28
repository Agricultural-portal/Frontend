"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Switch } from "../ui/switch";
import { Badge } from "../ui/badge";
import { Shield, Settings as SettingsIcon, Bell, Database, Lock, Key, Server, Cpu } from "lucide-react";
import { toast } from "sonner";

export function AdminSettings() {
  const handleSaveChanges = () => {
    toast.success("Platform configuration updated", {
      description: "Changes have been propagated to all live nodes."
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">System Configuration</h1>
        <p className="text-muted-foreground font-medium">Fine-tune platform protocols and administrative security</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-muted/50 p-1 h-auto rounded-xl">
          <TabsTrigger value="profile" className="rounded-lg py-2 font-bold px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">Identity</TabsTrigger>
          <TabsTrigger value="system" className="rounded-lg py-2 font-bold px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">Core Engine</TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-lg py-2 font-bold px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">Alerting</TabsTrigger>
          <TabsTrigger value="security" className="rounded-lg py-2 font-bold px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">Vault Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card className="border-none shadow-sm overflow-hidden border-l-4 border-l-primary/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Administrative Credentials
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 pt-4">
              <div className="flex items-center gap-6 p-6 rounded-2xl bg-muted/20 border border-border/50">
                <Avatar className="w-24 h-24 border-4 border-primary/10 ring-4 ring-background">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin" />
                  <AvatarFallback className="bg-primary text-primary-foreground text-3xl font-black">AD</AvatarFallback>
                </Avatar>
                <div className="space-y-3 flex-1">
                  <div className="flex gap-2">
                    <Button className="font-bold shadow-lg shadow-primary/10" size="sm">Update Avatar</Button>
                    <Button variant="outline" className="font-bold" size="sm">Reset to Default</Button>
                  </div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-tight">Requirement: 512x512 PNG, Max Payload 2.0MB</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5"><Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Admin First Name</Label><Input className="bg-muted/30 border-none font-bold" defaultValue="Admin" /></div>
                <div className="space-y-1.5"><Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Admin Last Name</Label><Input className="bg-muted/30 border-none font-bold" defaultValue="User" /></div>
                <div className="space-y-1.5"><Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Recovery Email</Label><Input className="bg-muted/30 border-none font-bold italic" defaultValue="admin@farmlink.direct" /></div>
                <div className="space-y-1.5"><Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Emergency Comms</Label><Input className="bg-muted/30 border-none font-bold" defaultValue="+91 98765 00000" /></div>
              </div>

              <Button onClick={handleSaveChanges} className="font-black px-12 shadow-xl shadow-primary/10 h-11">Commit Profile Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card className="border-none shadow-sm overflow-hidden border-l-4 border-l-chart-1/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Server className="w-5 h-5 text-chart-1" />
                Platform Protocols
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-4">
              {[
                { label: "Mainframe Maintenance", desc: "Instantly halt all platform activity for critical patching", icon: Database },
                { label: "Automatic Producer Onboarding", desc: "Bypass manual verification for newly registered farmers", icon: Cpu },
                { label: "Buyer Procurement Liquidity", desc: "Allow buyers to place orders before identity verification complets", check: true },
                { label: "Edge Computing Caching", desc: "Serve market trends from edge nodes for sub-10ms latency", check: true }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl hover:bg-muted/30 transition-colors">
                  <div className="space-y-1">
                    <Label className="font-bold text-sm block">{item.label}</Label>
                    <p className="text-xs text-muted-foreground font-medium italic">{item.desc}</p>
                  </div>
                  <Switch defaultChecked={item.check} />
                </div>
              ))}

              <div className="pt-6 border-t mt-4 flex justify-end">
                <Button onClick={handleSaveChanges} className="bg-chart-1 hover:bg-chart-1/90 text-white font-black px-12 h-11">Sync Configuration</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="border-none shadow-sm overflow-hidden border-l-4 border-l-destructive/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Lock className="w-5 h-5 text-destructive" />
                Platform Defense
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-2 space-y-6">
              <div className="bg-muted/30 p-4 rounded-xl space-y-4">
                <h3 className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2"><Key className="w-3 h-3" />Rotation of Admin Access</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input type="password" placeholder="Existing Passphrase" />
                  <Input type="password" placeholder="New Complexity String" />
                </div>
                <Button variant="secondary" className="font-bold w-full md:w-auto px-10">Rotate Credentials</Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-destructive/5 rounded-xl border border-destructive/10">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-destructive">Platform-Wide Lockdown</p>
                  <p className="text-[10px] font-medium text-muted-foreground">Force terminate every active session across all clusters instantly.</p>
                </div>
                <Button variant="destructive" className="font-black px-6">TERMINATE ALL</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
