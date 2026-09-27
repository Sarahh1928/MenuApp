import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import RestaurantMenu from "./pages/RestaurantMenu/RestaurantMenu";
import Login from "./pages/Login/Login";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import DashboardMenu from "./pages/Dashboard/DashboardMenu";
import DashboardOrders from "./pages/Dashboard/DashboardOrders";
import DashboardStats from "./pages/Dashboard/DashboardStats";
import DashboardProfile from "./pages/Dashboard/DashboardProfile";
import LanguageSwitcher from "./components/common/LanguageSwitcher";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import NotFound from "./pages/notFound/NotFound";

function GlobalLanguageSwitcher() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");
  if (isDashboard) return null;
  return <LanguageSwitcher />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <GlobalLanguageSwitcher />
            <Routes>
              <Route path="/r/:restaurantSlug" element={<RestaurantMenu />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardMenu />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/orders"
                element={
                  <ProtectedRoute>
                    <DashboardOrders />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/stats"
                element={
                  <ProtectedRoute>
                    <DashboardStats />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/profile"
                element={
                  <ProtectedRoute>
                    <DashboardProfile />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
