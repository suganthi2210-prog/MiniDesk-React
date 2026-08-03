import { Navigate } from "react-router-dom";
import { getStoredToken } from "../services/auth";

function ProtectedRoute({ children }) {
    // Only allow the protected screens to render when a valid auth token exists.
    const token = getStoredToken();

    if (!token) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default ProtectedRoute;