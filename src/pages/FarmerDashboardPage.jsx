import { useState, Suspense, lazy } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "@/lib/AppContext";
import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";

// Lazy load day components
const Dashboard = lazy(() => import("@/components/pages/Dashboard").then(m => ({ default: m.Dashboard })));
const Tasks = lazy(() => import("@/components/pages/Tasks").then(m => ({ default: m.Tasks })));
const CropCycles = lazy(() => import("@/components/pages/CropCycles").then(m => ({ default: m.CropCycles })));
const Finances = lazy(() => import("@/components/pages/Finances").then(m => ({ default: m.Finances })));
const Products = lazy(() => import("@/components/pages/Products").then(m => ({ default: m.Products })));
const Weather = lazy(() => import("@/components/pages/Weather").then(m => ({ default: m.Weather })));
const GovernmentSchemes = lazy(() => import("@/components/pages/GovernmentSchemes").then(m => ({ default: m.GovernmentSchemes })));
const Ratings = lazy(() => import("@/components/pages/Ratings").then(m => ({ default: m.Ratings })));
const Settings = lazy(() => import("@/components/pages/Settings").then(m => ({ default: m.Settings })));

export default function FarmerDashboardPage() {
    const navigate = useNavigate();
    const { role, page } = useParams();
    const { setCurrentUser } = useAppContext();

    // Default to dashboard if no page specified
    const currentPage = page || "dashboard";

    const handleNavigate = (targetPage) => {
        navigate(`/farmer/${targetPage}`);
    };

    const handleLogout = () => {
        setCurrentUser(null);
        navigate("/login");
    };

    const renderPage = () => {
        switch (currentPage) {
            case "dashboard": return <Dashboard />;
            case "tasks": return <Tasks />;
            case "crops": return <CropCycles />;
            case "finances": return <Finances />;
            case "products": return <Products />;
            case "weather": return <Weather />;
            case "schemes": return <GovernmentSchemes />;
            case "ratings": return <Ratings />;
            case "settings": return <Settings />;
            default: return <Dashboard />;
        }
    };

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <Sidebar
                currentPage={currentPage}
                onNavigate={handleNavigate}
                onLogout={handleLogout}
            />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar onNavigate={handleNavigate} />
                <main className="flex-1 overflow-auto bg-slate-50/50 dark:bg-transparent">
                    <Suspense fallback={<div className="p-6">Loading...</div>}>
                        {renderPage()}
                    </Suspense>
                </main>
            </div>
        </div>
    );
}
