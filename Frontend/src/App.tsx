
import { Routes, Route, useLocation, Link } from "react-router-dom";

import Navbar from "./Components/Navbar";
import Footer from "./Components/footer";

import Home from "./Pages/Home";
import Shop from "./Pages/Shop";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import Login from "./Pages/login";
import Register from "./Pages/Register";

import Cart from "./Pages/Cart";
import Checkout from "./Pages/Checkout";
import ProductDetails from "./Pages/ProductDetails";
import Wishlist from "./Pages/Wishlist";

// Admin pages
import AdminDashboard from "./Pages/Dashboard/AdminDashboard";
import ProductsManagement from "./Pages/Dashboard/ProductsManagement";
import Order from "./Pages/Dashboard/Orders";
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
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Shopping pages */}
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/wishlist" element={<Wishlist />} />

        {/* Admin dashboard pages */}
        <Route
          path="/dashboard/admin"
          element={<AdminDashboard />}
        />
        <Route
          path="/dashboard/products"
          element={<ProductsManagement />}
        />
        <Route
          path="/dashboard/orders"
          element={<Order />}
        />
        <Route
          path="/dashboard/settings"
          element={<Settings />}
        />

        {/* Customer dashboard pages */}
        <Route
          path="/account"
          element={<CustomerDashboard />}
        />
        <Route
          path="/account/orders"
          element={<MyOrders />}
        />
        <Route
          path="/account/profile"
          element={<MyProfile />}
        />
        <Route
          path="/account/settings"
          element={<MySettings />}
        />

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
                to="/"
                className="mt-5 rounded-lg bg-orange-600 px-5 py-3 font-semibold text-white transition hover:bg-orange-700"
              >
                Back to Home
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
