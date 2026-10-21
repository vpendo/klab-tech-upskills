
import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Pendo Hub API",
      version: "1.0.0",
      description:
        "REST API for Pendo Hub, an online shop for shoes and clothes for men and women.",
    },

    servers: [
      {
        url: process.env.API_URL || "http://localhost:5000",
        description: "API Server",
      },
    ],

    tags: [
      {
        name: "Auth",
        description: "User authentication and password management",
      },
      {
        name: "Products",
        description: "Product management and product statistics",
      },
      {
        name: "Cart",
        description: "Customer shopping cart management",
      },
      {
        name: "Wishlist",
        description: "Customer wishlist management",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token",
        },
      },
    },
  },

  apis: ["./src/router/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
