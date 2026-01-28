import { useNavigate } from "react-router-dom";
import { Register } from "@/components/Register";
import { toast } from "sonner";

export default function RegisterPage() {
    const navigate = useNavigate();

    const handleRegister = async (data) => {
        try {
            // Split fullName into first and last name
            const nameParts = data.fullName.trim().split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || 'User'; // Provide default if no last name
            
            // Ensure we have both first and last name
            if (!firstName.trim()) {
                toast.error("Please provide a valid full name");
                return;
            }
            
            // Parse location into city and state
            const locationParts = data.location.split(',').map(part => part.trim());
            const city = locationParts[0] || '';
            const state = locationParts[1] || '';

            let payload;
            let endpoint;

            if (data.role === 'admin') {
                payload = {
                    firstName: firstName,
                    lastName: lastName,
                    email: data.email,
                    phone: data.phone,
                    addresss: data.location, // Use full location as address
                    city: city,
                    state: state,
                    pincode: '', // Default empty
                    password: data.password
                };
                endpoint = "http://localhost:8080/api/auth/signup/admin";
            } else if (data.role === 'buyer') {
                payload = {
                    firstName: firstName,
                    lastName: lastName,
                    email: data.email,
                    phone: data.phone,
                    addresss: data.location,
                    city: city,
                    state: state,
                    pincode: '',
                    password: data.password
                };
                endpoint = "http://localhost:8080/api/auth/signup/buyer";
            } else if (data.role === 'farmer') {
                payload = {
                    firstName: firstName,
                    lastName: lastName,
                    email: data.email,
                    phone: data.phone,
                    addresss: data.location,
                    city: city,
                    state: state,
                    pincode: '',
                    farmSize: parseFloat(data.farmSize) || 0,
                    farmType: 'MIXED', // Default farm type
                    password: data.password
                };
                endpoint = "http://localhost:8080/api/auth/signup/farmer";
            }

            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const message = await response.text();
                toast.success(message || "Registration successful! Please login.");
                navigate("/login");
            } else {
                const errorText = await response.text();
                toast.error(`Registration failed: ${errorText || "Verify your details"}`);
            }
        } catch (error) {
            console.error("Registration error", error);
            toast.error("An error occurred during registration");
        }
    };

    const handleSwitchToLogin = () => {
        navigate("/login");
    };

    return (
        <Register
            onRegisterSuccess={handleRegister}
            onSwitchToLogin={handleSwitchToLogin}
        />
    );
}
