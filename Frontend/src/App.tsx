
import { Routes, Route, useLocation, Link, Navigate } from "react-router-dom";

import Navbar from "./Components/Navbar";
import Footer from "./Components/footer";

// Public pages
import Home from "./Pages/Home";
import Shop from "./Pages/Shop";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import Login from "./Pages/login";
import Register from "./Pages/Register";
import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";

// Shopping pages
import Cart from "./Pages/Cart";
import Checkout from "./Pages/Checkout";
import ProductDetails from "./Pages/ProductDetails";
import Wishlist from "./Pages/Wishlist";

// Admin pages
import AdminLayout from "./Pages/Dashboard/AdminLayout";
import AdminDashboard from "./Pages/Dashboard/AdminDashboard";
import ProductsManagement from "./Pages/Dashboard/ProductsManagement";
import Order from "./Pages/Dashboard/Orders";
import Customers from "./Pages/Dashboard/Customers";
import Settings from "./Pages/Dashboard/Settings";

// Customer pages
import CustomerDashboard from "./Pages/Dashboard/CustomerDashboard";
import MyOrders from "./Pages/Dashboard/MyOrders";
import MyProfile from "./Pages/Dashboard/MyProfile";
import MySettings from "./Pages/Dashboard/MySettings";

const App = () => {
  const location = useLocation();

  // Hide the store Navbar and Footer on dashboard pages.
  const isDashboard =
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/account");

  return (
    <>
      {!isDashboard && <Navbar />}

      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* Authentication pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Shopping pages */}
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/wishlist" element={<Wishlist />} />

        {/* Admin dashboard with shared layout */}
        <Route path="/dashboard" element={<AdminLayout />}>
          <Route index element={<Navigate to="admin" replace />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="products" element={<ProductsManagement />} />
          <Route path="orders" element={<Order />} />
          <Route path="customers" element={<Customers />} />
          <Route path="settings" element={<Settings />} />

          {/* Store page inside the admin layout */}
          <Route path="shop" element={<Shop />} />
        </Route>

        {/* Customer dashboard */}
        <Route path="/account" element={<CustomerDashboard />} />
        <Route path="/account/cart" element={<Cart />} />
        <Route path="/account/wishlist" element={<Wishlist />} />
        <Route path="/account/orders" element={<MyOrders />} />
        <Route path="/account/profile" element={<MyProfile />} />
        <Route path="/account/settings" element={<MySettings />} />

        {/* 404 page */}
        <Route
          path="*"
          element={
            <main className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
              <p className="text-sm font-bold uppercase tracking-widest text-orange-600">
                PendoHub
              </p>

              <h1 className="mt-3 text-3xl font-bold text-gray-900">
                404 - Page Not Found
              </h1>

              <p className="mt-2 max-w-md text-gray-500">
                Sorry, the page you are looking for does not exist
                or may have been moved.
              </p>

              <Link
                to="/shop"
                className="mt-5 rounded-lg bg-orange-600 px-5 py-3 font-semibold text-white transition hover:bg-orange-700"
              >
                Browse Products
              </Link>
            </main>
          }
        />
      </Routes>

      {!isDashboard && <Footer />}
    </>
  );
};

export default App;
