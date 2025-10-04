// middleware/errorHandler.js
export default (err, req, res, next) => {
    console.error(err.stack);

    let status = err.status || 500;
    let message = err.message || "Internal Server Error";

    // Handle specific Mongoose errors
    if (err.name === "ValidationError") {
        status = 400;
        message = "Validation failed. Please check your input data.";
    }

    if (err.name === "CastError") {
        status = 400;
        message = "Invalid ID format.";
    }

    // Handle duplicate key error (e.g., unique fields)
    if (err.code && err.code === 11000) {
        status = 400;
        message = "Duplicate key error. That value already exists.";
    }

    // Handle not found (you set this manually in controllers)
    if (status === 404) {
        message = "Resource not found.";
    }

    res.status(status).json({
        error: message,
        ...(process.env.NODE_ENV !== "production" && { details: err.message }), // show details only in dev
    });
};
