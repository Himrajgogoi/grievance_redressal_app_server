const express = require("express");
const router = express.Router();

const { ensureAuthenticated } = require("../config/authenticate");

const Accepted = require("../models/Accepted")

router.get("/", (req, res) => {
    Accepted.find({}).then(issues => res.status(200).json({ accepted: issues }));
})



module.exports = router;