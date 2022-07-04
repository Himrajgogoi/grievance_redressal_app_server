const bcrypt = require("bcryptjs");
const User = require("../models/User");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

// serializing the user
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// deserializing the user
passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    })
})

// Local Strategy
passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
        // Finding the user
        User.findOne({ email: email })
            .then(user => {

                // if no such user
                if (!user) {
                    return done("no such user!");
                }

                // Return existing user
                else {
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) throw err;

                        if (isMatch) {
                            return done(null, user);
                        } else {
                            return done("wrong password!")
                        }
                    })
                }
            })
            .catch(err => {
                done(err)
            })
    })
);

module.exports = passport;