
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
      {
        name: "Orders",
        description:
          "Customer order placement, order history, and admin order management",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description:
            "Enter your JWT token to access protected endpoints.",
        },
      },

      schemas: {
        OrderStatus: {
          type: "string",
          enum: [
            "Pending",
            "Processing",
            "Shipped",
            "Delivered",
            "Cancelled",
          ],
          example: "Pending",
        },

        OrderItemInput: {
          type: "object",
          required: ["productId", "quantity"],
          properties: {
            productId: {
              type: "string",
              example: "671a12345678901234567890",
              description: "MongoDB ID of the product.",
            },
            quantity: {
              type: "integer",
              minimum: 1,
              example: 2,
            },
          },
        },

        CreateOrderInput: {
          type: "object",
          required: [
            "customerName",
            "email",
            "phone",
            "address",
            "items",
          ],
          properties: {
            customerName: {
              type: "string",
              example: "Pendo Vestine",
            },
            email: {
              type: "string",
              format: "email",
              example: "customer@example.com",
            },
            phone: {
              type: "string",
              example: "+250788123456",
            },
            address: {
              type: "string",
              example: "Kigali, Rwanda",
            },
            items: {
              type: "array",
              minItems: 1,
              items: {
                $ref: "#/components/schemas/OrderItemInput",
              },
            },
          },
        },
      },
    },
  },

  apis: ["./src/router/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
