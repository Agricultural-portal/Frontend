import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Login } from "@/components/Login";
import { useAppContext } from "@/lib/AppContext";
import authService from "../services/authService";

export default function LoginPage() {
    const navigate = useNavigate();
    const { login, isAuthenticated, user } = useAppContext();

    // Redirect if already logged in
    useEffect(() => {
        if (isAuthenticated && user) {
            const role = user.role?.toUpperCase();
            switch (role) {
                case "FARMER":
                    navigate("/farmer/dashboard", { replace: true });
                    break;
                case "BUYER":
                    navigate("/buyer/dashboard", { replace: true });
                    break;
                case "ADMIN":
                    navigate("/admin/dashboard", { replace: true });
                    break;
                default:
                    break;
            }
        }
    }, [isAuthenticated, user, navigate]);

    const handleLogin = (userData) => {
        // Update AppContext with user data
        login(userData);
    };

    const handleSwitchToRegister = () => {
        navigate("/register");
    };

    return <Login onLogin={handleLogin} onSwitchToRegister={handleSwitchToRegister} />;
}
