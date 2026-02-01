import { useNavigate } from "react-router-dom";
import { Register } from "@/components/Register";
import { toast } from "sonner";

export default function RegisterPage() {
    const navigate = useNavigate();

    const handleRegister = async (data) => {
        try {
            // Validate that we have both first and last name
            if (!data.firstName.trim() || !data.lastName.trim()) {
                toast.error("Please provide both first name and last name");
                return;
            }

            let payload;
            let endpoint;

            if (data.role === 'admin') {
                payload = {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    phone: data.phone,
                    addresss: data.addresss,
                    city: data.city,
                    state: data.state,
                    pincode: data.pincode,
                    password: data.password
                };
                endpoint = "http://localhost:8080/api/auth/signup/admin";
            } else if (data.role === 'buyer') {
                payload = {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    phone: data.phone,
                    addresss: data.addresss,
                    city: data.city,
                    state: data.state,
                    pincode: data.pincode,
                    password: data.password
                };
                endpoint = "http://localhost:8080/api/auth/signup/buyer";
            } else if (data.role === 'farmer') {
                payload = {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    phone: data.phone,
                    addresss: data.addresss,
                    city: data.city,
                    state: data.state,
                    pincode: data.pincode,
                    farmSize: parseFloat(data.farmSize) || 0,
                    farmType: data.farmType || 'MIXED',
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
                // Try to parse as JSON first (for structured error responses)
                let errorMessage = "Registration failed. Please verify your details.";
                try {
                    const errorData = await response.json();
                    // Extract the message from the error response
                    errorMessage = errorData.message || errorMessage;
                } catch (e) {
                    // If JSON parsing fails, try to get text
                    try {
                        const errorText = await response.text();
                        if (errorText) {
                            errorMessage = errorText;
                        }
                    } catch (textError) {
                        // Use default message
                    }
                }
                toast.error(errorMessage);
            }
        } catch (error) {
            console.error("Registration error", error);
            toast.error("An error occurred during registration. Please try again.");
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
