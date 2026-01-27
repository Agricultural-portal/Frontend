"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import adminService from "@/services/adminService";
import {
  Users,
  ShoppingBag,
  Package,
  DollarSign,
  UserPlus,
} from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";
import { Skeleton } from "../ui/skeleton";

export function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getDashboardStats();
      setStats(data);
    } catch (err) {
      setError(err.message || "Failed to load dashboard statistics");
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const statCards = [
    {
      title: "Total Farmers",
      value: stats.totalFarmers,
      description: "Registered farmers",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950/20",
    },
    {
      title: "Total Buyers",
      value: stats.totalBuyers,
      description: "Registered buyers",
      icon: ShoppingBag,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
    },
    {
      title: "Products Listed",
      value: stats.totalProducts,
      description: "Available products",
      icon: Package,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950/20",
    },
    {
      title: "Platform Revenue",
      value: `₹${stats.platformRevenue?.toLocaleString() || "0"}`,
      description: "5% commission earned",
      icon: DollarSign,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950/20",
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                      {stat.title}
                    </p>
                    <h2 className={`text-3xl font-bold ${stat.color}`}>
                      {stat.value}
                    </h2>
                    <p className="text-xs text-muted-foreground font-medium">
                      {stat.description}
                    </p>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Buyers and Farmers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Buyers */}
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-blue-600" />
              <CardTitle className="text-lg font-bold">Recent Buyers</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">
              Latest 5 registered buyers
            </p>
          </CardHeader>
          <CardContent>
            {stats.recentBuyers && stats.recentBuyers.length > 0 ? (
              <div className="space-y-3">
                {stats.recentBuyers.map((buyer) => (
                  <div
                    key={buyer.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    {buyer.profileImageUrl ? (
                      <img
                        src={buyer.profileImageUrl}
                        alt={buyer.firstName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">
                        {buyer.firstName} {buyer.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {buyer.email}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        {buyer.city && (
                          <span className="text-xs text-muted-foreground">
                            📍 {buyer.city}
                          </span>
                        )}
                        {buyer.phone && (
                          <span className="text-xs text-muted-foreground">
                            📱 {buyer.phone}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        {new Date(buyer.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No buyers registered yet
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent Farmers */}
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-green-600" />
              <CardTitle className="text-lg font-bold">Recent Farmers</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">
              Latest 5 registered farmers
            </p>
          </CardHeader>
          <CardContent>
            {stats.recentFarmers && stats.recentFarmers.length > 0 ? (
              <div className="space-y-3">
                {stats.recentFarmers.map((farmer) => (
                  <div
                    key={farmer.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    {farmer.profileImageUrl ? (
                      <img
                        src={farmer.profileImageUrl}
                        alt={farmer.firstName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                        <Users className="w-5 h-5 text-green-600" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">
                        {farmer.firstName} {farmer.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {farmer.email}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        {farmer.city && (
                          <span className="text-xs text-muted-foreground">
                            📍 {farmer.city}
                          </span>
                        )}
                        {farmer.phone && (
                          <span className="text-xs text-muted-foreground">
                            📱 {farmer.phone}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        {new Date(farmer.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No farmers registered yet
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
