import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";

const App = () => {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<h1>Home Page</h1>} />
        <Route path="/shop" element={<h1>Our Services</h1>} />
        <Route path="/about" element={<h1>About Us</h1>} />
        <Route path="/contact" element={<h1>Contact Us</h1>} />
      </Routes>
    </>
  );
};

export default App;