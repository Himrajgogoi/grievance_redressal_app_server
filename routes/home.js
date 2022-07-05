const express = require("express");
const router = express.Router();

const { ensureAuthenticated } = require("../config/authenticate");
const Issues = require("../models/Issues")

router.get("/", (req, res) => {
    Issues.find({}).then(issues => res.status(200).json({ issues: issues }));
})



module.exports = router;