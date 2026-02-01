"use client";

import React from 'react';
import { Package, ShoppingCart, TrendingUp, Heart, ArrowRight } from 'lucide-react';
import { useAppContext } from "@/lib/AppContext";
import ProductCard from '../ProductCard';
import WalletCard from '../farmer/WalletCard';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

export function BuyerDashboard({ onNavigate }) {
  const { cart, favorites, orders, products, currentUser, dashboardStats, addToCart, addToFavorites, removeFromFavorites } = useAppContext();

  // Use backend stats for most things, but local cart for real-time updates
  const cartCount = cart.length > 0 ? cart.reduce((total, item) => total + item.quantity, 0) : dashboardStats.cartItemsCount;
  const cartSubtotal = cart.reduce((total, item) => {
    const price = typeof item.price === 'number' ? item.price : parseFloat(item.price.replace(/[^\d.]|₹/g, '')) || 0;
    return total + (price * item.quantity);
  }, 0);
  // Calculate grand total like in cart (with fees)
  const cartTax = cartSubtotal * 0.05;
  const cartDelivery = cart.length > 0 ? 50 : 0;
  const cartTotal = cartSubtotal + cartTax + cartDelivery;

  const statsCards = [
    {
      title: 'Total Orders',
      value: dashboardStats.totalOrders,
      subtitle: 'Completed transactions',
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Cart Items',
      value: cartCount,
      subtitle: `₹${cartTotal.toFixed(2)} total`,
      icon: ShoppingCart,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Total Spent',
      value: `₹${dashboardStats.totalSpent.toLocaleString()}`,
      subtitle: 'Account total',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Favorites',
      value: dashboardStats.favoritesCount,
      subtitle: 'Saved for later',
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    }
  ];

  const featuredProducts = products.slice(0, 4);
  
  console.log('Products in dashboard:', products.length);
  console.log('Featured products:', featuredProducts.length);

  const isFavorite = (id) => favorites.includes(id);
  const toggleFavorite = (id) => {
    if (isFavorite(id)) {
      removeFromFavorites(id);
    } else {
      addToFavorites(id);
    }
  };

  const getStatusColor = (status) => {
    if (!status) return "bg-slate-100 text-slate-500";
    const s = status.toLowerCase();
    switch (s) {
      case "delivered": return "bg-green-100 text-green-700";
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "cancelled": return "bg-red-100 text-red-700";
      default: return "bg-slate-100 text-slate-500";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold">Buyer Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Explore fresh products from local farmers.
        </p>
      </div>

      {/* Stats Cards and Wallet */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="border-none shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <h2 className={`text-2xl font-bold ${stat.color}`}>{stat.value}</h2>
                      <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
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
        <div className="lg:row-span-1">
          <WalletCard />
        </div>
      </div>

      {/* Featured Products */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Featured Products</h2>
          <Button
            variant="ghost"
            className="text-primary hover:text-primary/80"
            onClick={() => onNavigate?.("browse")}
          >
            View All <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                showSimple={true}
                addToCart={addToCart}
                toggleFavorite={toggleFavorite}
                isFavorite={isFavorite}
              />
            ))}
          </div>
        ) : (
          <Card className="border-none shadow-sm">
            <CardContent className="p-8 text-center">
              <div className="text-muted-foreground">
                <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No Products Available</h3>
                <p className="text-sm">Products will appear here once farmers add them to the marketplace.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recent Orders */}
      <div className="space-y-4 pb-12">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Recent Orders</h2>
          <Button
            variant="ghost"
            className="text-primary hover:text-primary/80"
            onClick={() => onNavigate?.("orders")}
          >
            Manage All <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
        <div className="space-y-3">
          {orders.slice(0, 3).map(order => (
            <Card key={order.id} className="border-none shadow-sm">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                      #{order.id}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{order.product}</p>
                      <p className="text-xs text-muted-foreground">{new Date(order.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                    <Badge className={`${getStatusColor(order.status)} border-none capitalize`}>
                      {order.status}
                    </Badge>
                    <p className="font-bold text-slate-900">₹{order.totalAmount.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
