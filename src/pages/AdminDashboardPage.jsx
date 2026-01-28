"use client";

import { useState, Suspense, lazy } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "@/lib/AppContext";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminNavbar } from "@/components/admin/AdminNavbar";

// Lazy load components
const AdminDashboard = lazy(() => import("@/components/admin/AdminDashboard").then(m => ({ default: m.AdminDashboard })));
const ManageFarmers = lazy(() => import("@/components/admin/ManageFarmers").then(m => ({ default: m.ManageFarmers })));
const ManageBuyers = lazy(() => import("@/components/admin/ManageBuyers").then(m => ({ default: m.ManageBuyers })));
const AllOrders = lazy(() => import("@/components/admin/AllOrders").then(m => ({ default: m.AllOrders })));
const AdminSchemes = lazy(() => import("@/components/admin/AdminSchemes").then(m => ({ default: m.AdminSchemes })));
const AdminSettings = lazy(() => import("@/components/admin/AdminSettings").then(m => ({ default: m.AdminSettings })));

export default function AdminDashboardPage() {
    const navigate = useNavigate();
    const { page } = useParams();
    const { setCurrentUser } = useAppContext();

    const currentPage = page || "dashboard";

    const handleNavigate = (targetPage) => {
        navigate(`/admin/${targetPage}`);
    };

    const handleLogout = () => {
        setCurrentUser(null);
        navigate("/login");
    };

    const renderPage = () => {
        switch (currentPage) {
            case "dashboard": return <AdminDashboard />;
            case "farmers": return <ManageFarmers />;
            case "buyers": return <ManageBuyers />;
            case "orders": return <AllOrders />;
            case "schemes": return <AdminSchemes />;
            case "settings": return <AdminSettings />;
            default: return <AdminDashboard />;
        }
    };

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <AdminSidebar
                currentPage={currentPage}
                onNavigate={handleNavigate}
                onLogout={handleLogout}
            />
            <div className="flex-1 flex flex-col overflow-hidden">
                <AdminNavbar onLogout={handleLogout} />
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
