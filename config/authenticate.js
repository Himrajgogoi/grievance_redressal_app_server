// for authenticating routes
module.exports = {
    ensureAuthenticated: (req, res, next) => {
        if (req.isAuthenticated()) return next();
        res.status(401).json({ error: "Login first" });
    },
    isAdmin: (req, res, next) => {
        if (req.isAuthenticated() && req.user.admin) return next();
        res.status(403).json({ error: "You don't have administrative privileges" });

    }
}