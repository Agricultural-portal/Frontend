import { useNavigate } from "react-router-dom";
import { Login } from "@/components/Login";
import { useAppContext } from "@/lib/AppContext";
import { toast } from "sonner";
import { API_BASE_URL } from "@/services/config";

export default function LoginPage() {
    const navigate = useNavigate();
    const { setCurrentUser } = useAppContext();

    const handleLogin = async (selectedRole, email, password) => {
        try {
            // Attempt backend login
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const user = await response.json();
                // Normalize role to lowercase for frontend routing
                const role = user.role.toLowerCase();

                setCurrentUser({
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    fullName: user.fullName, // Keep for backward compatibility
                    name: user.fullName, // Keep for backward compatibility
                    email: user.email,
                    role: role,
                    token: user.token
                });

                console.log("User set after login:", {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    fullName: user.fullName,
                    email: user.email,
                    role: role,
                    hasToken: !!user.token
                });

                toast.success(`Welcome back, ${user.firstName}!`);
                navigate(`/${role}/dashboard`);
                return;
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || "Login failed. Please check your credentials.");
            }
        } catch (error) {
            console.error("Backend login failed:", error);
            toast.error("Unable to connect to server. Please try again later.");
        }
    };

    const handleSwitchToRegister = () => {
        navigate("/register");
    };

    return <Login onLogin={handleLogin} onSwitchToRegister={handleSwitchToRegister} />;
}

