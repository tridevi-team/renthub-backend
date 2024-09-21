import path from "path";
import swaggerJSDoc from "swagger-jsdoc";

const PORT = process.env.PORT || 3000;

const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "RenHub API Documentation",
        version: "1.0.0",
        description: "Renthub is a graduation topic of the tridevi team. It helps home managers easily manage their homes effectively.",
    },
    servers: [
        {
            url: `http://localhost:${PORT}`,
            description: "Local server",
        },
        {
            url: `https://sandbox.tmquang.com`,
            description: "Sandbox server",
        },
        {
            url: `https://api.tmquang.com`,
            description: "Production server",
        },
    ],
    basePath: "/",
};

const swaggerOptions = {
    swaggerDefinition,
    apis: [path.join(__dirname, "./src/API/*.yaml")],
};

// Continue with the rest of your code
export const swaggerSpec = swaggerJSDoc(swaggerOptions);
