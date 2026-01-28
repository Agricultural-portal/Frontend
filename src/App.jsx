import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "@/lib/AppContext";
import { Toaster } from "@/components/ui/sonner";
import Home from "@/pages/Home";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import FarmerDashboardPage from "@/pages/FarmerDashboardPage";

// Placeholders for other roles
import BuyerDashboardPage from "@/pages/BuyerDashboardPage";
import AdminDashboardPage from "@/pages/AdminDashboardPage";

function App() {
    return (
        <AppProvider>
            <Router future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* Farmer Routes */}
                    <Route path="/farmer" element={<Navigate to="/farmer/dashboard" replace />} />
                    <Route path="/farmer/:page" element={<FarmerDashboardPage />} />

                    {/* Buyer Routes */}
                    <Route path="/buyer" element={<Navigate to="/buyer/dashboard" replace />} />
                    <Route path="/buyer/product/:id" element={<BuyerDashboardPage />} />
                    <Route path="/buyer/:page" element={<BuyerDashboardPage />} />

                    {/* Admin Routes */}
                    <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                    <Route path="/admin/:page" element={<AdminDashboardPage />} />

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
                <Toaster />
            </Router>
        </AppProvider>
    );
}

export default App;
