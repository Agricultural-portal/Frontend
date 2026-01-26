import { Navigate } from "react-router-dom";
import { useAppContext } from "@/lib/AppContext";
import authService from "../services/authService";

/**
 * ProtectedRoute component to guard routes based on authentication and role
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render
 * @param {string[]} props.allowedRoles - Array of roles allowed to access this route
 */
export function ProtectedRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated, user } = useAppContext();

  // Check if user is authenticated
  if (!isAuthenticated || !authService.getToken()) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  // Check if user has the required role
  if (allowedRoles.length > 0) {
    const userRole = user?.role?.toUpperCase();
    const hasAccess = allowedRoles.some(
      (role) => role.toUpperCase() === userRole
    );

    if (!hasAccess) {
      // Redirect to appropriate dashboard based on user's actual role
      switch (userRole) {
        case "FARMER":
          return <Navigate to="/farmer/dashboard" replace />;
        case "BUYER":
          return <Navigate to="/buyer/dashboard" replace />;
        case "ADMIN":
          return <Navigate to="/admin/dashboard" replace />;
        default:
          return <Navigate to="/login" replace />;
      }
    }
  }

  // User is authenticated and has required role
  return children;
}

export default ProtectedRoute;
