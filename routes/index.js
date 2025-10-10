import express from "express";
import passport from "passport";

const router = express.Router();

// Mount Swagger if needed (but it's already in server.js, so optional here).
// router.use("/", require("./swagger")); // Convert to import if needed, but avoid duplication.

// Login route: Starts GitHub OAuth flow.
// When hit, Passport redirects to GitHub for authentication.
router.get("/login", passport.authenticate("github"));

// Logout route: Clears the session and logs user out.
// Passport's req.logout() handles cleanup.
router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        // Async logout to handle any errors.
        if (err) {
            return next(err);
        }
        req.session.destroy(() => {
            // Fully destroy session for security.
            res.redirect("/"); // Redirect to home after logout.
        });
    });
});

export default router;
