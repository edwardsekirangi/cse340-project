import express from "express";
import { connectDB } from "./db/connect.js";
import carRoutes from "./routes/carRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import reviewRoutes from "./routes/reviewRoutes.js";
const app = express();
//connecting to dotenv
import dotenv from "dotenv";
dotenv.config();
//middleware
app.use(express.json());

//routes
app.use("/cars", carRoutes);
app.use("/reviews", reviewRoutes);

//Root route
app.get("/", (req, res) => {
    res.send("Welcome to the Home page of the Car API");
});

//Swagger setup
import { swaggerDocs, swaggerSpec } from "./swagger.js";
app.use("/api-docs", swaggerDocs.serve, swaggerDocs.setup(swaggerSpec));
console.log(
    `✅ Swagger docs available at http://localhost:${process.env.PORT || 3500}/api-docs`
);

//error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3500;

//Start server after DB connection
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`✅ Server running on http://localhost:${PORT}`);
    });
});
