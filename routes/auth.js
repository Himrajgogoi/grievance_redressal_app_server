const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require('dotenv').config();

// for login
router.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            return res.status(400).json({ errors: err });
        }

        req.logIn(user, { session: false }, (err) => {
            if (err) {
                return res.status(400).json({ errors: err });
            }
            // const body = { _id: user._id, email: user.email, department: user.department };
            const token = jwt.sign({ user: user }, process.env.TOKEN, { expiresIn: 3600 });
            return res.status(200).json({ status: `logged in ${user.email}`, token: token, department: user.department });
        });
    })(req, res, next);
})

// for register
router.post('/register', (req, res) => {
    const { email, password, department } = req.body;
    if (!email || !password || !department) {
        res.status(400).json({ error: "Enter all fields!" });
    } else {
        User.findOne({ email: email })
            .then(user => {
                if (user) res.status(400).json({ error: "User exists!" });
                else {
                    const newUser = new User({ email, password, department });
                    // Hashing the password before storing it in the database
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            newUser.password = hash;
                            newUser.save()
                                .then(user => {
                                    res.status(200).json({ status: "You are registered." })
                                })
                                .catch(err => {
                                    res.status(400).json({ error: err.message });
                                })
                        })
                    });
                }
            })
            .catch(err => {
                res.status(400).json({ error: err.message });
            })
    }
})

// logging out the user
router.get("/logout", (req, res) => {

    delete req.user;
    res.status(200).json({ status: "logged out" })
})

module.exports = router;