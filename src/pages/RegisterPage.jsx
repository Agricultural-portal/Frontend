import { useNavigate } from "react-router-dom";
import { Register } from "@/components/Register";
import { toast } from "sonner";

export default function RegisterPage() {
    const navigate = useNavigate();

    const handleRegisterSuccess = () => {
        toast.success("Registration successful! Please login.");
        navigate("/login");
    };

    const handleSwitchToLogin = () => {
        navigate("/login");
    };

    return (
        <Register
            onRegisterSuccess={handleRegisterSuccess}
            onSwitchToLogin={handleSwitchToLogin}
        />
    );
}
