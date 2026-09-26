 import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRole }) => {

    const token = localStorage.getItem("token");
    const roleId = String(
        localStorage.getItem("RoleId") || ""
    ).trim();


    // Token nahi hai
    if (!token) {
        return <Navigate to="/login" replace />;
    }


    // Allowed roles ko array mein convert karo
    const allowedRoles = Array.isArray(allowedRole)
        ? allowedRole.map((role) => String(role).trim())
        : [String(allowedRole).trim()];


    // Role match nahi karta
    if (
        allowedRole &&
        !allowedRoles.includes(roleId)
    ) {
        return <Navigate to="/" replace />;
    }


    return <Outlet />;
};

export default ProtectedRoute;