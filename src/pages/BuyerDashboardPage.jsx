"use client";

import { useState, Suspense, lazy } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "@/lib/AppContext";
import { BuyerSidebar } from "@/components/buyer/BuyerSidebar";
import { BuyerNavbar } from "@/components/buyer/BuyerNavbar";

// Lazy load components
const BuyerDashboard = lazy(() => import("@/components/buyer/BuyerDashboard").then(m => ({ default: m.BuyerDashboard })));
const BrowseProducts = lazy(() => import("@/components/buyer/BrowseProducts").then(m => ({ default: m.BrowseProducts })));
const MyCart = lazy(() => import("@/components/buyer/MyCart").then(m => ({ default: m.MyCart })));
const MyOrders = lazy(() => import("@/components/buyer/MyOrders").then(m => ({ default: m.MyOrders })));
const ConnectFarmers = lazy(() => import("@/components/buyer/ConnectFarmers").then(m => ({ default: m.ConnectFarmers })));
const Favorites = lazy(() => import("@/components/buyer/Favorites").then(m => ({ default: m.Favorites })));
const ProductDetail = lazy(() => import("@/components/buyer/ProductDetail").then(m => ({ default: m.ProductDetail })));
const BuyerProfile = lazy(() => import("@/components/buyer/BuyerProfile").then(m => ({ default: m.BuyerProfile })));
const Notifications = lazy(() => import("@/components/pages/Notifications").then(m => ({ default: m.Notifications })));
const Settings = lazy(() => import("@/components/pages/Settings").then(m => ({ default: m.Settings })));

export default function BuyerDashboardPage() {
    const navigate = useNavigate();
    const { page } = useParams();
    const { logout } = useAppContext();

    const currentPage = page || "dashboard";

    const handleNavigate = (targetPage) => {
        navigate(`/buyer/${targetPage}`);
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const renderPage = () => {
        // Check if it's a product detail page
        if (currentPage.startsWith('product/')) {
            return <ProductDetail />;
        }
        
        switch (currentPage) {
            case "dashboard": return <BuyerDashboard onNavigate={handleNavigate} />;
            case "browse": return <BrowseProducts />;
            case "cart": return <MyCart />;
            case "orders": return <MyOrders />;
            case "favorites": return <Favorites onNavigate={handleNavigate} />;
            case "notifications": return <Notifications />;
            case "settings": return <Settings />;
            case "profile": return <BuyerProfile />;
            default: return <BuyerDashboard onNavigate={handleNavigate} />;
        }
    };

    return (
        <div className="flex h-screen overflow-hidden bg-white">
            <BuyerSidebar
                currentPage={currentPage}
                onNavigate={handleNavigate}
                onLogout={handleLogout}
            />
            <div className="flex-1 flex flex-col ml-64 overflow-hidden">
                <BuyerNavbar onNavigate={handleNavigate} onLogout={handleLogout} />
                <main className="flex-1 overflow-auto bg-slate-50/10">
                    <Suspense fallback={
                        <div className="flex h-full items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    }>
                        {renderPage()}
                    </Suspense>
                </main>
            </div>
        </div>
    );
}
