import express from "express";
import { connectDB } from "./db/connect.js";
import carRoutes from "./routes/carRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import session from "express-session";
import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();  // Load .env variables (e.g., GITHUB_CLIENT_ID).

const app = express();

// Middleware setup.
// Body parsers first for handling JSON/URL-encoded data.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session setup: Stores auth state. Use a strong secret in production.
// Updated: Added cookie options for better handling in dev (sameSite: 'lax' allows cookies in cross-site contexts like redirects; secure: false for http localhost).
app.use(session({
    secret: process.env.SESSION_SECRET || "secret",  // Use .env for this.
    resave: false,
    saveUninitialized: false,
    cookie: {
        sameSite: 'lax',  // Allows cookies on cross-site GET requests (e.g., redirects from GitHub).
        secure: false,    // False for dev (http); set to true in prod (https).
        httpOnly: true,   // Prevents JS access to cookie for security.
        maxAge: 24 * 60 * 60 * 1000  // 1 day expiration.
    }
}));

// Initialize Passport and tie it to sessions.
// This enables Passport to use sessions for storing user data.
app.use(passport.initialize());
app.use(passport.session());

// Updated CORS: Consolidated here (removed manual setHeader middleware to avoid conflicts).
// Added credentials: true to allow cookies/sessions.
// For origin, use a function to dynamically allow (avoids wildcard issues with credentials).
// In prod, specify exact origins (e.g., your frontend URL).
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (e.g., server-to-server) or from localhost/Swagger.
        if (!origin || origin.includes('localhost')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH", "OPTIONS"],
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
    credentials: true  // Key fix: Allows cookies/credentials to be sent/received.
}));

// Passport GitHub Strategy: Unchanged.
passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: process.env.CALLBACK_URL,
        },
        (accessToken, refreshToken, profile, done) => {
            console.log("GitHub Profile:", profile);  // Debug: See what GitHub sends.
            return done(null, profile);
        }
    )
);

// Serialize/Deserialize: Unchanged (full profile for simplicity).
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

// Auth routes: Unchanged.
app.get("/login", passport.authenticate("github"));

app.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.session.destroy(() => {
            res.redirect("/");
        });
    });
});

app.get('/github/callback', passport.authenticate('github', {
    failureRedirect: '/api-docs'
}), (req, res) => {
    console.log('Callback hit successfully! User:', req.user);  // Debug.
    res.redirect('/');
});

// Root route: Unchanged.
app.get("/", (req, res) => {
    res.send(
        req.user
            ? `Logged in as ${req.user.username || req.user.displayName}. <a href="/logout">Logout</a>`
            : 'Logged out. <a href="/login">Login with GitHub</a>'
    );
});

// API routes: Unchanged.
app.use("/cars", carRoutes);
app.use("/reviews", reviewRoutes);

import { swaggerSpec, swaggerUiMiddleware } from "./swagger.js";

app.use("/api-docs", swaggerUiMiddleware.serve, swaggerUiMiddleware.setup(swaggerSpec));

console.log(`✅ Swagger docs at http://localhost:${process.env.PORT || 3500}/api-docs`);

// Error handler: Last middleware.
app.use(errorHandler);

// Start server after DB connect.
connectDB().then(() => {
    const PORT = process.env.PORT || 3500;
    app.listen(PORT, () => {
        console.log(`✅ Server running on http://localhost:${PORT}`);
    });
});