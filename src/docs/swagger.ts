import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Reviews de Propriedades",
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer" },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/controllers/*.ts"],
};

export default swaggerJSDoc(options);
