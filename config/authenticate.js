const passport = require("passport");

// middleware for authenticating routes
module.exports = {
    ensureAuthenticated: passport.authenticate('jwt', { session: false }),
    isAdmin: (req, res, next) => {
        if (req.user.admin) return next();
        res.status(403).json({ error: "You don't have administrative privileges" });

    }
}