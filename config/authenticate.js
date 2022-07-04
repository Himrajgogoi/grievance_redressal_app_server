// for authenticating routes
module.exports = {
    ensureAuthenticated: (req, res, next) => {
        if (req.isAuthenticated()) return next();
        res.status(400).json({ message: "Login first" });
    },
    forwardAuthenticated: (req, res, next) => {
        if (!req.isAuthenticated()) return next();
        res.redirect("/");
    }
}