import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "@/lib/AppContext";
import { Toaster } from "@/components/ui/sonner";
import { ProtectedRoute } from "@/components/ProtectedRoute";
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
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* Farmer Routes - Protected */}
                    <Route 
                        path="/farmer" 
                        element={
                            <ProtectedRoute allowedRoles={["FARMER"]}>
                                <Navigate to="/farmer/dashboard" replace />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/farmer/:page" 
                        element={
                            <ProtectedRoute allowedRoles={["FARMER"]}>
                                <FarmerDashboardPage />
                            </ProtectedRoute>
                        } 
                    />

                    {/* Buyer Routes - Protected */}
                    <Route 
                        path="/buyer" 
                        element={
                            <ProtectedRoute allowedRoles={["BUYER"]}>
                                <Navigate to="/buyer/dashboard" replace />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/buyer/:page" 
                        element={
                            <ProtectedRoute allowedRoles={["BUYER"]}>
                                <BuyerDashboardPage />
                            </ProtectedRoute>
                        } 
                    />

                    {/* Admin Routes - Protected */}
                    <Route 
                        path="/admin" 
                        element={
                            <ProtectedRoute allowedRoles={["ADMIN"]}>
                                <Navigate to="/admin/dashboard" replace />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/admin/:page" 
                        element={
                            <ProtectedRoute allowedRoles={["ADMIN"]}>
                                <AdminDashboardPage />
                            </ProtectedRoute>
                        } 
                    />

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
                <Toaster />
            </Router>
        </AppProvider>
    );
}

export default App;
