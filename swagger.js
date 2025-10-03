import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// Swagger setup
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Car API",
            version: "1.0.0",
            description: "A simple Express Car API",
            contact: {
                name: "Edward Sekirangi",
                email: "sekirangi1@gmail.com"
            }
        },
        servers: [
            { url: "http://localhost:3500", description: "Development server" }
        ]
    },
    apis: ["./routes/*.js"]
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
export const swaggerDocs = swaggerUi; // exporting the middleware for setup
