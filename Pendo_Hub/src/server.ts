import express = require("express");
import mongoose = require("mongoose");
import dotenv = require("dotenv");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Pendo Hub API"
  });
});

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error);
  });

app.listen(PORT, () => {
  console.log(`Pendo Hub server running on http://localhost:${PORT}`);
});