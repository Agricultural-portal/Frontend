"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useAppContext } from "@/lib/AppContext";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import WalletCard from "../farmer/WalletCard";
import {
  Users,
  ShoppingBag,
  TrendingUp,
  Package,
  DollarSign,
  Activity,
  Calendar,
  Mail,
  MapPin,
} from "lucide-react";

export function AdminDashboard() {
  const { farmers, buyers, products, orders } = useAppContext();

  const totalFarmers = farmers.length;
  const activeFarmers = farmers.filter((f) => f.status === "active").length;
  const totalBuyers = buyers.length;
  const activeBuyers = buyers.filter((b) => b.status === "active").length;
  const totalProducts = products.length;
  const availableProducts = products.filter((p) => p.status === "Available" || p.status === "available").length;
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  
  // Calculate farmer revenue from delivered orders
  const deliveredOrders = orders.filter((o) => o.status === "DELIVERED" || o.status === "delivered");
  const totalFarmerRevenue = deliveredOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  
  // Platform revenue is 5% of farmer revenue
  const platformRevenue = totalFarmerRevenue * 0.05;

  // Get recent farmers and buyers (sorted by join date)
  const recentFarmers = [...farmers]
    .sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate))
    .slice(0, 5);
  
  const recentBuyers = [...buyers]
    .sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate))
    .slice(0, 5);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const stats = [
    {
      title: "Total Farmers",
      value: totalFarmers,
      description: `${activeFarmers} active on platform`,
      icon: Users,
      color: "text-chart-1",
      bgColor: "bg-chart-1/10",
    },
    {
      title: "Total Buyers",
      value: totalBuyers,
      description: `${activeBuyers} active buyers`,
      icon: ShoppingBag,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
    {
      title: "Products Listed",
      value: totalProducts,
      description: `${availableProducts} currently available`,
      icon: Package,
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
    },
    {
      title: "Total Orders",
      value: totalOrders,
      description: `${pendingOrders} awaiting processing`,
      icon: Activity,
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
    },
    {
      title: "Platform Revenue",
      value: `₹${platformRevenue.toLocaleString()}`,
      description: "5% commission on delivered orders",
      icon: DollarSign,
      color: "text-chart-1",
      bgColor: "bg-chart-1/10",
    },
    {
      title: "Farmer Revenue",
      value: `₹${totalFarmerRevenue.toLocaleString()}`,
      description: "Total from delivered orders",
      icon: TrendingUp,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Platform-wide overview and real-time statistics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{stat.title}</p>
                    <h2 className={`text-3xl font-black ${stat.color}`}>{stat.value}</h2>
                    <p className="text-xs text-muted-foreground font-medium">{stat.description}</p>
                  </div>
                  <div className={`p-4 rounded-2xl ${stat.bgColor} shadow-sm`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Wallet Card */}
      <WalletCard />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Users className="w-5 h-5 text-chart-1" />
              Recent Farmers
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">Newest farmer registrations</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentFarmers.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No farmers registered yet</p>
              ) : (
                recentFarmers.map((farmer) => (
                  <div
                    key={farmer.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-muted/40 to-muted/20 hover:from-muted/60 hover:to-muted/40 transition-all duration-200 border border-border/50"
                  >
                    <Avatar className="h-12 w-12 border-2 border-chart-1/20">
                      <AvatarImage src={farmer.profileImageUrl} alt={farmer.name} />
                      <AvatarFallback className="bg-chart-1/10 text-chart-1 font-bold">
                        {getInitials(farmer.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{farmer.name}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">{farmer.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge variant={farmer.status === "active" ? "default" : "secondary"} className="text-xs">
                        {farmer.status}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(farmer.joinDate)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-chart-2" />
              Recent Buyers
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">Newest buyer registrations</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentBuyers.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No buyers registered yet</p>
              ) : (
                recentBuyers.map((buyer) => (
                  <div
                    key={buyer.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-muted/40 to-muted/20 hover:from-muted/60 hover:to-muted/40 transition-all duration-200 border border-border/50"
                  >
                    <Avatar className="h-12 w-12 border-2 border-chart-2/20">
                      <AvatarImage src={buyer.profileImageUrl} alt={buyer.name} />
                      <AvatarFallback className="bg-chart-2/10 text-chart-2 font-bold">
                        {getInitials(buyer.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{buyer.name}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">{buyer.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge variant={buyer.status === "active" ? "default" : "secondary"} className="text-xs">
                        {buyer.status}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(buyer.joinDate)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="bg-muted/30 pb-4">
          <CardTitle className="text-lg font-bold">Consolidated Order Status</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-4 rounded-2xl bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/30 text-center">
              <p className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-1">Pending</p>
              <h3 className="text-2xl font-black text-orange-700">
                {orders.filter((o) => o.status === "pending").length}
              </h3>
            </div>
            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 text-center">
              <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">Confirmed</p>
              <h3 className="text-2xl font-black text-blue-700">
                {orders.filter((o) => o.status === "confirmed" || o.status === "in-transit").length}
              </h3>
            </div>
            <div className="p-4 rounded-2xl bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/30 text-center">
              <p className="text-xs font-bold text-green-600 uppercase tracking-widest mb-1">Delivered</p>
              <h3 className="text-2xl font-black text-green-700">
                {orders.filter((o) => o.status === "delivered").length}
              </h3>
            </div>
            <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 text-center">
              <p className="text-xs font-bold text-red-600 uppercase tracking-widest mb-1">Cancelled</p>
              <h3 className="text-2xl font-black text-red-700">
                {orders.filter((o) => o.status === "cancelled").length}
              </h3>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
