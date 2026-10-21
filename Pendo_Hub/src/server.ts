
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import swaggerUi from "swagger-ui-express";

import productRouter from "./router/product.router";
import authRouter from "./router/auth.router";
import { connectDB } from "./config/db";
import swaggerSpec from "./config/swagger";

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 5000;

// Allow requests from the React frontend
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware
app.use(express.json());

// Home route
app.get("/", (_req, res) => {
  res.json({
    message: "Welcome to Pendo Hub API",
  });
});

// Authentication routes
app.use("/api/auth", authRouter);

// Product routes
app.use("/api", productRouter);

// Swagger documentation
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

// Connect to MongoDB before starting the server
const startServer = async (): Promise<void> => {
  try {
    await connectDB();

    app.listen(port, () => {
      console.log(`Pendo Hub server running on port ${port}`);
      console.log(`Swagger UI: http://localhost:${port}/api-docs`);
    });
  } catch (error) {
    console.error("Failed to start Pendo Hub server:", error);
    process.exit(1);
  }
};

void startServer();
