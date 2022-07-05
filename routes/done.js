const express = require("express");
const router = express.Router();

const { ensureAuthenticated } = require("../config/authenticate");

const Done = require("../models/Done")

router.get("/", (req, res) => {
    Done.find({}).then(issues => res.status(200).json({ done: issues }));
})



module.exports = router;