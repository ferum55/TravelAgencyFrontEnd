import { useEffect, useRef } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./components/AuthContext";

import Login from "./components/Login";
import Register from "./components/Register";
import Layout from "./layout/Layout";

export default function App() {
  const { user, login } = useAuth();
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      const rawUser = localStorage.getItem("user");
      try {
        if (rawUser) {
          const parsed = JSON.parse(rawUser);
          if (parsed?.role && parsed?.username) login(parsed);
        }
      } catch (e) {
        console.error("Помилка при читанні user з localStorage:", e);
        localStorage.removeItem("user");
      }
      initialized.current = true;
    }
  }, [login]);

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  const userRolePath = user.role.toLowerCase(); // напр. "trainer", "internalmanager", "purchasemanager"

  return (
    <Routes>
      <Route path="/login" element={<Navigate to={`/${userRolePath}`} replace />} />
      <Route path="/register" element={<Navigate to={`/${userRolePath}`} replace />} />

      {/* доступні роуті для кожного */}
      <Route
        path="/tourmanager"
        element={user.role === "TourManager" ? <Layout /> : <Navigate to={`/${userRolePath}`} />}
      />
      <Route
        path="/clientmanager"
        element={user.role === "ClientManager" ? <Layout /> : <Navigate to={`/${userRolePath}`} />}
      />
      <Route
        path="/insurancemanager"
        element={user.role === "InsuranceManager" ? <Layout /> : <Navigate to={`/${userRolePath}`} />}
      />

      {/* fallback: якщо щось інше — редірект на свою роль */}
      <Route path="*" element={<Navigate to={`/${userRolePath}`} />} />
    </Routes>
  );
}