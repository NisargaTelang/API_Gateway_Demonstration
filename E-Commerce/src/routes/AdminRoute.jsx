// src/routes/AdminRoute.jsx
import { Navigate } from "react-router-dom";
import ErrorNotAdmin from "../pages/ErrorNotAdmin";

export default function AdminRoute({ user, children }) {


  if (!user) return <Navigate to="/" replace />;

  if (user.role !== "ADMIN") {
    return <ErrorNotAdmin />;
  }

  return children;
}
