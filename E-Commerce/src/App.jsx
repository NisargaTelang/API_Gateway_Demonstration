// src/App.jsx
import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import AuthModal from "./components/AuthModal";

import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AddProduct from "./pages/admin/AddProductModal";
import AdminOrders from "./pages/admin/AdminOrders";

import AdminRoute from "./routes/AdminRoute";

export default function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [authLoaded, setAuthLoaded] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (raw) setUser(JSON.parse(raw));
    setAuthLoaded(true);    

  }, []);

  function handleAuthSuccess(u) {
    setUser(u);
    if (u.role === "ADMIN") navigate("/admin");
    else navigate("/");
  }

  function handleLogout() {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  }

  return (
    <>
      <Navbar user={user} onLoginClick={() => setShowAuth(true)} onLogout={handleLogout} />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home onLoginRequest={() => setShowAuth(true)} />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/orders" element={<Orders />} />

        {/* ✅ Admin Protected Routes */}
        <Route
          path="/admin"

          element={
            <AdminRoute user={user}>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/add-product"
          element={
            <AdminRoute user={user}>
              <AddProduct />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <AdminRoute user={user}>
              <AdminOrders />
            </AdminRoute>
          }
        />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {/* Auth Modal */}
      <AuthModal
        show={showAuth}
        onClose={() => setShowAuth(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </>
  );
}
