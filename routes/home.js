const express = require("express");
const router = express.Router();
const { forwardAuthenticated, ensureAuthenticated } = require("../config/authenticate");

router.get("/home", ensureAuthenticated, (req, res) => {
    res.send("you are authenticated");
})

module.exports = router;