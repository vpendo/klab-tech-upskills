import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Pendo Hub API",
      version: "1.0.0",
      description: "API for Pendo Hub online shop",
    },

    servers: [
      {
        url: "http://localhost:5000",
      },
    ],
  },

  apis: ["./src/router/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;

