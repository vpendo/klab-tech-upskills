import { Routes, Route } from "react-router-dom";

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

const App = () => {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/wishlist" element={<Wishlist />} />

        <Route
          path="*"
          element={
            <main className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
              <h1 className="text-3xl font-bold text-gray-900">
                404 - Page Not Found
              </h1>

              <p className="mt-2 text-gray-500">
                Sorry, the page you are looking for does not exist.
              </p>

              <a
                href="/"
                className="mt-5 rounded-lg bg-orange-600 px-5 py-2 font-semibold text-white hover:bg-orange-700"
              >
                Back to Home
              </a>
            </main>
          }
        />
      </Routes>

      <Footer />
    </>
  );
};

export default App;
