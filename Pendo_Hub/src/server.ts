import express from "express";
import dotenv from "dotenv";
import productRouter from "./router/product.router";
import { connectDB } from "./config/db";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger";

dotenv.config();

const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Pendo Hub API",
  });
});

app.use("/api", productRouter);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

connectDB();

app.listen(port, () => {
  console.log(`Pendo Hub server running on port ${port}`);
  console.log(`Swagger UI: http://localhost:${port}/api-docs`);
});
