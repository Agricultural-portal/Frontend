"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useAppContext } from "@/lib/AppContext";
import {
  Users,
  ShoppingBag,
  TrendingUp,
  Package,
  DollarSign,
  Activity,
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
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalFarmerRevenue = farmers.reduce((sum, f) => sum + f.totalRevenue, 0);

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
      value: `₹${totalRevenue.toLocaleString()}`,
      description: "Gross GMV of platform",
      icon: DollarSign,
      color: "text-chart-1",
      bgColor: "bg-chart-1/10",
    },
    {
      title: "Farmer Revenue",
      value: `₹${totalFarmerRevenue.toLocaleString()}`,
      description: "Direct earnings for farmers",
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold">Top Performing Farmers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {farmers.slice(0, 5).map((farmer) => (
                <div
                  key={farmer.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex flex-col">
                    <p className="font-bold">{farmer.name}</p>
                    <p className="text-xs text-muted-foreground">{farmer.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-primary">₹{farmer.totalRevenue.toLocaleString()}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-tight font-bold">{farmer.totalProducts} products listed</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold">Recent Active Buyers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {buyers.slice(0, 5).map((buyer) => (
                <div
                  key={buyer.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex flex-col">
                    <p className="font-bold">{buyer.name}</p>
                    <p className="text-xs text-muted-foreground">{buyer.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-primary">₹{buyer.totalSpent.toLocaleString()}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-tight font-bold">{buyer.totalOrders} total orders</p>
                  </div>
                </div>
              ))}
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
