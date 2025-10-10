const isAuthenticated = (req, res, next) => {
    console.log('Auth check: req.user exists?', !!req.user);  // Debug: Logs true/false.
    console.log('Session user:', req.session.user);  // Debug: If manual session set (though we rely on Passport).
    if (!req.user) {  // Simplified: Passport sets req.user if authenticated.
        return res.status(401).json({ error: "You do not have access. Please log in." });
    }
    next();
};

export default isAuthenticated;